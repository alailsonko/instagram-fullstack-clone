import prisma from '../../../infra/db/prisma/prisma.helper'
import Authorization from '../../../infra/middleware/authorization.middleware'
import UserRepository from '../../../infra/repositories/users/users.repositories'
import AuthToken from '../../../infra/services/auth-token.service'

function makeAuthorization(): Authorization {
  const userRepository = new UserRepository(prisma)
  const authToken = new AuthToken(userRepository)
  return new Authorization(userRepository, authToken)
}

export { makeAuthorization }
