import { IResolvers } from "graphql-tools";
import { MutationCreatePostArgs, File } from "../generated";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { finished } from "stream/promises";
import path from "path";
import fs from "fs";
import { Prisma } from "@prisma/client";
import http from "http";
import AuthToken from "../../../infra/services/auth-token.service";
import Authorization from "../../../infra/middleware/authorization.middleware";
import { authorization } from "../../../presentation/factories/middleware/authorization.factory";
import { ContextGraphQL } from "../../../domain/auth/context";
import { AuthenticationError } from "apollo-server-express";

export const PostResolvers: IResolvers = {
  // Query: {
  //   async login (
  //     _: undefined,
  //     args: QueryLoginArgs,
  //     ctx
  //   ) {
  //     const signinController = makeSignInController()
  //     return await signinController.handle(args, ctx)
  //   }
  // },
  Upload: GraphQLUpload,
  Mutation: {
    async createPost(
      _: undefined,
      args: MutationCreatePostArgs,
      ctx: ContextGraphQL
    ): Promise<File> {
      if (!(await authorization().isLogged(ctx.token))) {
        throw new AuthenticationError("must be logged in.");
      }
      const files = args.file as FileUpload[];
      const medias = [] as Prisma.MediaCreateInput[];
      const post = {} as Prisma.PostCreateInput;
      for await (const file of files) {
        const { createReadStream, filename, mimetype, encoding } = file;
        const stream = createReadStream();
        const __dirname = path.resolve();
        const fileName = `${+new Date()}_${filename}`;
        const filePath = path.join(__dirname, "src", "uploads/") + fileName;
        const out = fs.createWriteStream(filePath);
        stream.pipe(out);
        await finished(out);

        medias.push({
          url: filePath,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      Object.assign(post, {
        description: args.description,
        medias,
      });
      return {
        filename: "somename",
        encoding: "some",
        mimetype: "some",
      };
    },
  },
};
