import { IResolvers } from 'graphql-tools'
import { merge } from 'lodash'
import { UserResolvers } from './resolvers/UserResolver'

const resolversMap: IResolvers = merge(UserResolvers)

export default resolversMap
