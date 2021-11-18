import { IResolvers } from "graphql-tools";
import { MutationCreatePostArgs, Post } from "../generated";
import { GraphQLUpload } from "graphql-upload";
import { ContextGraphQL } from "../../../domain/auth/context";
import { AuthenticationError } from "apollo-server-express";
import { ContextGraphQLogged } from "../../../presentation/controllers/posts/create-post.controller";
import makeCreatePostController from "../../../presentation/factories/controllers/posts/create-post.factory";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub()

export const PostResolvers: IResolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    async createPost(
      _: undefined,
      args: MutationCreatePostArgs,
      ctx: ContextGraphQL
    ): Promise<Post> {
      if (!ctx.isLogged) {
        throw new AuthenticationError('not authorized')
      }
      const createPostController = makeCreatePostController()
      const response = await createPostController.handle(args, ctx as ContextGraphQLogged)
      pubsub.publish('POST_CREATED', { postCreated: response });
      return response
    },
  },
  Subscription: {
    postCreated: {
        subscribe: () => pubsub.asyncIterator(['POST_CREATED'])
    }
  }
};
