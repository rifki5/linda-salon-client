import * as fs from 'fs'
import * as path from 'path'
import https from 'https'
import { parse, execute } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'
import { introspectionQuery, buildClientSchema, printSchema, } from 'graphql/utilities'
import fetch from 'node-fetch'

// Make sure unhandled errors in async code are propagated correctly
process.on('uncaughtException', error => {
  console.error(error);
  process.exit(1);
});
process.on('unhandledRejection', error => {
  throw error;
});

async function fetchRemoteSchema(url, insecure) {
  const agent =
    /^https:\/\//i.test(url) && insecure
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;
  const body = JSON.stringify({ query: introspectionQuery });
  const method = 'POST';
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, {
      agent,
      method,
      headers,
      body
    });
    const result = await response.json();

    if (result.errors) {
      throw new Error(`Errors in introspection query result: ${result.errors}`);
    }
    if (!result.data) {
      throw new Error(`No introspection query result data from: ${JSON.stringify(result)}`);
    }
    return buildClientSchema(result.data);
  } catch (e) {
    throw new Error(`Error while fetching introspection query: ${e.message}`);
  }
}

// Copy from graphql-js library, will be released in new version
// https://github.com/graphql/graphql-js/blob/master/src/utilities/introspectionFromSchema.js
async function introspectionFromSchema(schema /* GraphQLSchema */) {
  const queryAST = parse(introspectionQuery);
  const result = await execute(schema, queryAST);
  return result.data; /* IntrospectionQuery */
}

async function introspectSchema(remoteURL, clientURL, output) {
  return fetchRemoteSchema(remoteURL, true)
    .then(schema => {
      const clientSchemas = fileLoader(clientURL);
      const remoteSchema = printSchema(schema);
      const typeDefs = mergeTypes([...clientSchemas, remoteSchema], {
        all: true
      });
      return makeExecutableSchema({ typeDefs });
    })
    .then(schema => {
      return introspectionFromSchema(schema);
    })
    .then(introspection => {
      const json = JSON.stringify(introspection, null, 2);
      fs.writeFileSync(output, json);
    })
    .catch(err => {
      console.error('Error while generating types for schema:', err);
    });
}

const remoteSchema = 'http://localhost:4000/graphql';
const clientSchema = path.resolve('schema/*.graphql');
const output = path.resolve('./generate/schema.json');

// Generate an introspection JSON format from remote GraphQL server merging
// with any local GraphQL schemas
introspectSchema(remoteSchema, clientSchema, output);