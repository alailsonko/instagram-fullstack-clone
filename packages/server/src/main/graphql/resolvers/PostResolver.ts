import { IResolvers } from "graphql-tools";
import { MutationCreatePostArgs, Post } from "../generated";
import { GraphQLUpload } from "graphql-upload";
import { ContextGraphQL } from "../../../domain/auth/context";
import { AuthenticationError } from "apollo-server-express";
import { ContextGraphQLogged } from "../../../presentation/controllers/posts/create-post.controller";
import makeCreatePostController from "../../../presentation/factories/controllers/posts/create-post.factory";
import { PubSub } from "graphql-subscriptions";
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
} from "graphql-relay";
import { PostType } from "./schema.types";
import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import PostRepository from "../../../infra/repositories/posts/posts.repository";
import prisma from "../../../infra/db/prisma/prisma.helper";

const pubsub = new PubSub();

const { connectionType: PostConnection, edgeType: PostEdge } =
  connectionDefinitions({
    nodeType: PostType,
  });

export const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "The root of all queries",
  fields: () => ({
    posts: {
      type: GraphQLNonNull(PostConnection),
      args: connectionArgs,
      resolve: async (_, args, ctx: ContextGraphQL) => {
        if (!ctx.isLogged) {
          throw new AuthenticationError("not authorized");
        }
        const response = await new PostRepository(prisma).findAll()
        return connectionFromArray(response, args);
      },
    },
  }),
});

export const PostResolvers: IResolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    async createPost(
      _: undefined,
      args: MutationCreatePostArgs,
      ctx: ContextGraphQL
    ): Promise<Post> {
      if (!ctx.isLogged) {
        throw new AuthenticationError("not authorized");
      }
      const createPostController = makeCreatePostController();
      const response = await createPostController.handle(
        args,
        ctx as ContextGraphQLogged
      );
      pubsub.publish("POST_CREATED", { postCreated: response });
      return response;
    },
  },
  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterator(["POST_CREATED"]),
    },
  },
};
