import { IResolvers } from 'graphql-tools'
import {
  MutationRegisterArgs,
  QueryLoginArgs
} from '../generated'
import SignUpController, { SignUpResponse } from '../../controllers/signup.controller'

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
      const signupController = new SignUpController()
      return await signupController.handle(args, ctx)
    }
  }
}
