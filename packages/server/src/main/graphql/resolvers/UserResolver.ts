import { IResolvers } from 'graphql-tools'
import {
  MutationRegisterArgs,
  QueryLoginArgs
} from '../generated'
import { SignUpResponse } from '../../../presentation/controllers/signup.controller'
import makeSignUpController from '../../../presentation/factories/signup.factory'

export const UserResolvers: IResolvers = {
  Query: {
    async login (
      _: undefined,
      args: QueryLoginArgs,
      ctx
    ) {
      console.log(args)
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
