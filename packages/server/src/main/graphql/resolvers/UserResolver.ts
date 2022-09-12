import { IResolvers } from 'graphql-tools'
import { MutationRegisterArgs, QueryLoginArgs } from '../generated'
import { SignUpResponse } from '../../../presentation/controllers/signup/signup.controller'
import makeSignUpController from '../../../presentation/factories/controllers/auth/signup.factory'
import makeSignInController from '../../../presentation/factories/controllers/auth/signin.factory'
import makeGetProfileBySlugController from '../../../presentation/factories/controllers/users/get-profile-by-slug.factory'

export const UserResolvers: IResolvers = {
  Query: {
    async login(_: undefined, args: QueryLoginArgs, ctx) {
      const signinController = makeSignInController()
      return await signinController.handle(args, ctx)
    },
    async getProfileBySlug(_: undefined, args: QueryLoginArgs, ctx) {
      const getProfileBySlugController = makeGetProfileBySlugController()
      return await getProfileBySlugController.handle(args, ctx)
    },
  },
  Mutation: {
    async register(_: undefined, args: MutationRegisterArgs, ctx): Promise<SignUpResponse> {
      const signupController = makeSignUpController()
      return await signupController.handle(args, ctx)
    },
  },
}
