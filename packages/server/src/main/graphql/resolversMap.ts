import { IResolvers } from 'graphql-tools'
import { merge } from 'lodash'
import { UserResolvers } from './resolvers/UserResolver'
import { PostResolvers } from './resolvers/PostResolver'

const resolversMap: IResolvers = merge(UserResolvers, PostResolvers)

export default resolversMap
