import prisma from '../../../../infra/db/prisma/prisma.helper'
import UserRepository from '../../../../infra/repositories/users/users.repositories'
import GetProfileBySlugController from '../../../controllers/users/get-profile-by-slug.controller'

function makeGetProfileBySlugController(): GetProfileBySlugController {
  const userRepository = new UserRepository(prisma)
  return new GetProfileBySlugController(userRepository)
}

export default makeGetProfileBySlugController
