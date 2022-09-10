import { AuthenticationError, UserInputError } from 'apollo-server'
import VerifyAccount from '../../../data/usecases/verify-account.usecases'
import { ContextGraphQL } from '../../../domain/auth/context'
import AuthToken from '../../../infra/services/auth-token.service'
import { AuthenticateResponse, QueryLoginArgs } from '../../../main/graphql/generated'
import { Controller } from '../controller.protocol'

interface INDEX_ARGS_Signature {
  email: 'email'
  username: 'username'
  password: 'password'
}

class SignInController implements Controller<AuthenticateResponse, QueryLoginArgs, ContextGraphQL> {
  private verifyAccount: VerifyAccount
  private authToken: AuthToken
  constructor(verifyAccount: VerifyAccount, authToken: AuthToken) {
    this.verifyAccount = verifyAccount
    this.authToken = authToken
  }

  async handle(args: QueryLoginArgs, ctx: ContextGraphQL): Promise<AuthenticateResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fields = ['email', 'username', 'password'] as [
      INDEX_ARGS_Signature['email'],
      INDEX_ARGS_Signature['username'],
      INDEX_ARGS_Signature['password']
    ]
    if (!args.email && !args.username) {
      throw new UserInputError('email or username must not be empty.')
    }
    if (!args.password) {
      throw new UserInputError('password must not be empty.')
    }
    const uniqueIdentifier = args.email ? `${args.email}|email` : `${args.username}|username`
    const [isValid, user] = await this.verifyAccount.verify({
      uniqueIdentifier,
      password: args.password,
    })
    if (!isValid || !user) {
      throw new AuthenticationError('authentication error.')
    }
    const token = await this.authToken.generate({
      email: user.email,
      username: user.username,
      idSerial: user.idSerial,
      id: user.id,
    })

    delete user.password
    return {
      token,
      user,
    }
  }
}

export default SignInController
