import { IResolvers } from "graphql-tools";
import { MutationCreatePostArgs, Post } from "../generated";
import { GraphQLUpload } from "graphql-upload";
import { ContextGraphQL } from "../../../domain/auth/context";
import { AuthenticationError } from "apollo-server-express";
import CreatePostController, { ContextGraphQLogged } from "../../../presentation/controllers/posts/create-post.controller";
import PostRepository from "../../../infra/repositories/posts/posts.repository";
import prisma from "../../../infra/db/prisma/prisma.helper";

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
      const postRepository = new PostRepository(prisma)
      return await new CreatePostController(postRepository).handle(args, ctx as ContextGraphQLogged)
    },
  },
};
