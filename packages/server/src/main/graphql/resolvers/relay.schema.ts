import { GraphQLSchema } from 'graphql'

import { QueryType } from './PostResolver'

const schema = new GraphQLSchema({
  query: QueryType
})

export default schema
