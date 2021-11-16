import prisma from "../../../infra/db/prisma/prisma.helper"
import Authorization from "../../../infra/middleware/authorization.middleware"
import UserRepository from "../../../infra/repositories/users/users.repositories"
import AuthToken from "../../../infra/services/auth-token.service"

function authorization() {
   const userRepository = new UserRepository(prisma)
   const authToken = new AuthToken()
   return new Authorization(userRepository, authToken)
}

export {
  authorization
}
