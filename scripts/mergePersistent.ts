import * as fs from 'fs'
import * as path from 'path'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'

const schema = path.resolve('./queries/**/*graphql')
const output = path.resolve('./schema/persistent.graphql')
const fileLoad = fileLoader(schema)
const mergeSchema = mergeTypes([...fileLoad])

fs.writeFileSync(output, mergeSchema)