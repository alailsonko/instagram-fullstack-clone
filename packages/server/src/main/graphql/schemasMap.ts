import 'graphql-import-node'
import * as UserTypeDefs from './schemas/schema.graphql'
import * as emptyTypeDefs from './schemas/empty.graphql'
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolversMap'
import { GraphQLSchema } from 'graphql'
import { merge } from 'lodash'

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: merge(emptyTypeDefs, UserTypeDefs),
  resolvers
})

export default schema
