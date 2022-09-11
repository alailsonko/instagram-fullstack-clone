import SignInController from '../../../controllers/signin/signin.controller'
import VerifyAccount from '../../../../data/usecases/verify-account.usecases'
import ComparePassword from '../../../../infra/cryptography/compare-password.cryptography'
import UserRepository from '../../../../infra/repositories/users/users.repositories'
import prisma from '../../../../infra/db/prisma/prisma.helper'
import AuthToken from '../../../../infra/services/auth-token.service'

function makeSignInController(): SignInController {
  const userRepository = new UserRepository(prisma)
  const comparePassword = new ComparePassword()
  const verifyAccount = new VerifyAccount(userRepository, comparePassword)
  const authToken = new AuthToken(userRepository)
  return new SignInController(verifyAccount, authToken)
}

export default makeSignInController
