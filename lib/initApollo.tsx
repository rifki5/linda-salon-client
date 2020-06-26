import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloLink, split } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'
import { createUploadLink } from 'apollo-upload-client'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { withClientState } from 'apollo-link-state'
import defaults from 'local_state/defaults'
import resolvers from 'local_state/resolvers'

declare let process : {
  browser: any
}

declare let global : {
  fetch: typeof fetch
}

type InitialState = NormalizedCacheObject | {}

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

const isFile = (value) => (
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob)
)

const isUpload = ({ variables }) => {
  let values = Object.keys(variables).map(key => variables[key]).some(isFile)
  return values
}

function create(initialState: InitialState, { getToken }) {
  const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'same-origin',

  })

  const authLink = setContext((_, { headers }) => {
    const token = getToken()
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      },
    }
  })

  const cache = new InMemoryCache({
    cacheRedirects: {
      Query: {
        product: (
          _, 
          { id }: any,
          { getCacheKey }
        ) => getCacheKey({ id, __typename: 'Product' }),
        item: (
          _, 
          { id }: any,
          { getCacheKey }
        ) => getCacheKey({ id, __typename: 'Item' }) ,
      }
    },
  }).restore(initialState || {})

  const stateLink = withClientState({
    cache,
    defaults: defaults,
    resolvers: resolvers,
    
  })

  const uploadLink = createUploadLink({
    uri: 'http://localhost:4000/graphql',
  })

  const httpLinkWithAuth = authLink.concat(httpLink)

  const persistentQueryHttpLink = createPersistedQueryLink({ useGETForHashedQueries: true }).concat(httpLinkWithAuth)

  const ultimateLink = ApolloLink.from([stateLink, persistentQueryHttpLink])

  const uploadLinkWithAuthToken = authLink.concat(uploadLink)

  const terminalLink = split(isUpload, uploadLinkWithAuthToken, ultimateLink)

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: terminalLink,
    cache
  })
}

export default function initApollo(initialState: InitialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}
