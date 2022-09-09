import { MutationCreatePostTypeArgs } from '../generated'
import { GraphQLUpload } from 'graphql-upload'
import { ContextGraphQL } from '../../../domain/auth/context'
import { AuthenticationError } from 'apollo-server-express'
import { ContextGraphQLogged } from '../../../presentation/controllers/posts/create-post.controller'
import makeCreatePostController from '../../../presentation/factories/controllers/posts/create-post.factory'
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  mutationWithClientMutationId,
} from 'graphql-relay'
import { PostType } from './schema.types'
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import PostRepository from '../../../infra/repositories/posts/posts.repository'
import prisma from '../../../infra/db/prisma/prisma.helper'

const { connectionType: PostConnection, edgeType: PostEdge } = connectionDefinitions({
  nodeType: PostType,
})

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries',
  fields: () => ({
    posts: {
      type: GraphQLNonNull(PostConnection),
      args: connectionArgs,
      resolve: async (_, args, ctx: ContextGraphQL) => {
        if (!ctx.isLogged) {
          throw new AuthenticationError('not authorized')
        }
        const response = await new PostRepository(prisma).findAll()
        return connectionFromArray(response, args)
      },
    },
  }),
})

export const PostMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root of all mutations',
  fields: () => ({
    createPost: mutationWithClientMutationId({
      name: 'CreatePost',
      inputFields: {
        description: {
          type: GraphQLNonNull(GraphQLString),
        },
        file: {
          type: GraphQLNonNull(GraphQLList(GraphQLUpload)),
        },
      },
      outputFields: {
        post: {
          type: PostType,
          resolve: payload => payload,
        },
      },
      mutateAndGetPayload: async (args: MutationCreatePostTypeArgs, ctx: ContextGraphQL) => {
        if (!ctx.isLogged) {
          throw new AuthenticationError('not authorized')
        }
        const controller = makeCreatePostController()
        return await controller.handle(args, ctx as ContextGraphQLogged)
      },
    }),
  }),
})
