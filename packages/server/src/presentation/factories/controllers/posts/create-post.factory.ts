import prisma from '../../../../infra/db/prisma/prisma.helper'
import PostRepository from '../../../../infra/repositories/posts/posts.repository'
import CreatePostController from '../../../controllers/posts/create-post.controller'

function makeCreatePostController(): CreatePostController {
  const postRepository = new PostRepository(prisma)
  return new CreatePostController(postRepository)
}

export default makeCreatePostController
