import { ContextGraphQL } from "../../domain/auth/context";
import {
  MutationRegisterArgs,
  AuthenticateResponse,
} from "../../main/graphql/generated";
import { O } from "ts-toolbelt";
import { Controller } from "./controller.protocol";
import { UserInputError, AuthenticationError } from "apollo-server";
import AddAccount from "../../data/usecases/add-account.usecases";
import { User } from "@prisma/client";
import AuthToken from "../../infra/services/auth-token.service";

type ResponseUser = O.Omit<User, "password">;


export type SignUpResponse = AuthenticateResponse;

interface INDEX_ARGS_Signature {
  email: "email";
  password: "password";
  username: "username";
  passwordConfirm: "passwordConfirm";
}

export default class SignUpController
  implements Controller<SignUpResponse, MutationRegisterArgs>
{
  private addAccount: AddAccount;
  private authToken: AuthToken
  constructor(addAccount: AddAccount, authToken: AuthToken) {
    this.addAccount = addAccount;
    this.authToken = authToken
  }
  async handle(
    args: O.Optional<MutationRegisterArgs, 'passwordConfirm'>,
    ctx: ContextGraphQL
  ): Promise<SignUpResponse> {
    const fields = ["email", "username", "password", "passwordConfirm"] as [
      INDEX_ARGS_Signature["email"],
      INDEX_ARGS_Signature["username"],
      INDEX_ARGS_Signature["password"],
      INDEX_ARGS_Signature["passwordConfirm"]
    ];

    for (const field of fields) {
      if (!(args as INDEX_ARGS_Signature)[field]) {
        throw new UserInputError(`${field} must not be empty.`);
      }
    }

    if (args.password !== args.passwordConfirm) {
      throw new AuthenticationError("authentication error.");
    }
   delete args.passwordConfirm
   const user = await this.addAccount.add(Object.assign(args, {
     createdAt: new Date(),
     updatedAt: new Date(),
   }))
   const token = await this.authToken.generate({
     email: user.email,
     username: user.username,
     id: user.id,
     uuid: user.uuid,
   })
    return {
      user,
      token,
    };
  }
}
