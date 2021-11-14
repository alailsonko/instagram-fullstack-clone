import { UserInputError } from "apollo-server";
import { ContextGraphQL } from "../../../domain/auth/context";
import { AuthenticateResponse, QueryLoginArgs } from "../../../main/graphql/generated";
import { Controller } from "../controller.protocol";

interface INDEX_ARGS_Signature {
  email: 'email';
  username: 'username';
  password: 'password';
}

class SignInController implements Controller<AuthenticateResponse, QueryLoginArgs> {
  async handle(args: QueryLoginArgs, ctx: ContextGraphQL): Promise<AuthenticateResponse> {
    const fields = ['email', 'username', 'password'] as [
      INDEX_ARGS_Signature['email'],
      INDEX_ARGS_Signature['username'],
      INDEX_ARGS_Signature['password'],
    ]
    if (!args['email'] && !args['username']) {
      throw new UserInputError('email or username must not be empty.')
    }
    if (!args['password']) {
      throw new UserInputError('password must not be empty.')
    }
    
    return {
     token: 'sometoken',
     user: {
       createdAt: new Date(),
       updatedAt: new Date(),
       email: 'valid@mail.com',
       id: 1,
       username: 'valid_username',
       uuid: '1234-abcd'
     }
   }
  };
}

export default SignInController
