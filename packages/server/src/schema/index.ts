import _ from 'lodash'
import userSchema from './auth'
import { makeExecutableSchema } from 'graphql-tools'

const schema = makeExecutableSchema({
  typeDefs: [
    userSchema.typeDefs
  ],
  resolvers: _.merge(
    userSchema.resolvers
  )
})

export default schema
