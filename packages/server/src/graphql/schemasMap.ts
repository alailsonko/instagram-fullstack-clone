import 'graphql-import-node'
import * as UserTypeDefs from './schemas/schema.graphql'
import * as emptyTypeDefs from './schemas/empty.graphql'
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolversMap'
import { GraphQLSchema } from 'graphql'

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [emptyTypeDefs, UserTypeDefs],
  resolvers
})

export default schema
