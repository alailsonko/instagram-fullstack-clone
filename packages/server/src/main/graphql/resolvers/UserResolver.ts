import { IResolvers } from 'graphql-tools'
import {
  MutationRegisterArgs,
  QueryLoginArgs
} from '../generated'
import { SignUpResponse } from '../../../presentation/controllers/signup/signup.controller'
import makeSignUpController from '../../../presentation/factories/signup.factory'
import makeSignInController from '../../../presentation/factories/signin.factory'

export const UserResolvers: IResolvers = {
  Query: {
    async login (
      _: undefined,
      args: QueryLoginArgs,
      ctx
    ) {
      const signinController = makeSignInController()
      return await signinController.handle(args, ctx)
    }
  },
  Mutation: {
    async register (
      _: undefined,
      args: MutationRegisterArgs,
      ctx
    ): Promise<SignUpResponse> {
      const signupController = makeSignUpController()
      return await signupController.handle(args, ctx)
    }
  }
}
