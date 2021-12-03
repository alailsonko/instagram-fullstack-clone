import { GraphQLSchema } from 'graphql'

import { PostMutation, QueryType } from './PostResolver'

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: PostMutation
})

export default schema
