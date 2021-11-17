import { Prisma } from "@prisma/client";
import { FileUpload } from "graphql-upload";
import path from "path";
import { ContextGraphQL } from "../../../domain/auth/context";
import { MutationCreatePostArgs, Post } from "../../../main/graphql/generated";
import { Controller } from "../controller.protocol";
import fs from "fs";
import PostRepository from "../../../infra/repositories/posts/posts.repository";
import { JWTResponse } from "../../../infra/services/auth-token.service";
import { UserInputError } from "apollo-server-express";

export interface ContextGraphQLogged extends Omit<ContextGraphQL, "user"> {
  user: JWTResponse;
}

class CreatePostController
  implements Controller<Post, MutationCreatePostArgs, ContextGraphQLogged>
{
  private postRepository: PostRepository;
  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }
  async handle(
    args: MutationCreatePostArgs,
    ctx: ContextGraphQLogged
  ): Promise<Post> {
    const files = args.file as FileUpload[];
    const medias = [] as Prisma.MediaCreateInput[];
    const post = {} as Prisma.PostCreateInput;

    if (files.length === 0) {
      throw new UserInputError("must have at least one file.");
    }

    for await (const file of files) {
      const { createReadStream, filename, mimetype, encoding } = file;
      const stream = createReadStream();
      const __dirname = path.resolve();
      const fileName = `${+new Date()}_${filename}`;
      const filePath = path.join(__dirname, "src", "uploads/") + fileName;
      const out = fs.createWriteStream(filePath);
      stream.pipe(out);

      medias.push({
        url: fileName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    Object.assign(post, {
      description: args.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const response = await this.postRepository.create({
      ...post,
      medias: {
        createMany: {
          data: medias as Prisma.Enumerable<Prisma.MediaCreateManyPostInput>,
          skipDuplicates: true,
        },
      },
      user: {
        connect: {
          id: ctx.user.id,
        },
      },
    });

    return {
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      id: response.id,
      medias: response.medias,
      description: response.description,
      user: response.user,
      userId: response.userId,
    };
  }
}

export default CreatePostController;
