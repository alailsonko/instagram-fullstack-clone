import AddAccount from '../../../../data/usecases/add-account.usecases'
import HashPassword from '../../../../infra/cryptography/hash-password.cryptography'
import prisma from '../../../../infra/db/prisma/prisma.helper'
import UserRepository from '../../../../infra/repositories/users/users.repositories'
import AuthToken from '../../../../infra/services/auth-token.service'
import SignUpController from '../../../controllers/signup/signup.controller'

function makeSignUpController(): SignUpController {
  const hashPassword = new HashPassword()
  const userRepository = new UserRepository(prisma)
  const addAccount = new AddAccount(hashPassword, userRepository)
  const authToken = new AuthToken(userRepository)
  return new SignUpController(addAccount, authToken)
}

export default makeSignUpController
