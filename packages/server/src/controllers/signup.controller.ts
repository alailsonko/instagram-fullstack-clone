import { ContextGraphQL } from '../domain/auth/context'
import {
  MutationRegisterArgs,
  AuthenticateResponse
} from '../graphql/generated'
import { Controller } from './controller.protocol'
import { UserInputError } from 'apollo-server'

export type SignUpResponse = AuthenticateResponse | UserInputError

interface INDEX_ARGS_Signature {
  email: 'email'
  password: 'password'
  username: 'username'
  passwordConfirm: 'passwordConfirm'
}

export default class SignUpController
implements Controller<SignUpResponse, MutationRegisterArgs> {
  async handle (
    args: MutationRegisterArgs,
    ctx: ContextGraphQL
  ): Promise<SignUpResponse> {
    console.log(args)
    console.log(ctx)
    const fields = ['email', 'username', 'password', 'passwordConfirm'] as [
      INDEX_ARGS_Signature['email'],
      INDEX_ARGS_Signature['username'],
      INDEX_ARGS_Signature['password'],
      INDEX_ARGS_Signature['passwordConfirm'],
    ]

    for (const field of fields) {
      if (!(args as INDEX_ARGS_Signature)[field]) { throw new UserInputError(`${field} must not be empty.`) }
    }

    return {
      user: {
        email: 'admin@admin.com',
        id: '1',
        username: 'admin'
      },
      token: 'sometoken'
    }
  }
}
