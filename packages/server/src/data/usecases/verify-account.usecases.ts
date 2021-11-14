import { Prisma } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { O } from "ts-toolbelt";
import ComparePassword from "../../infra/cryptography/compare-password.cryptography";
import UserRepository from "../../infra/repositories/users/users.repositories";
import { QueryLoginArgs } from "../../main/graphql/generated";

type CompulsoryQueryLogin = O.Compulsory<QueryLoginArgs, "email" | "username" | "password">;

interface IVerifyAccount {
  verify(data: CompulsoryQueryLogin): Promise<boolean>;
}

class VerifyAccount implements IVerifyAccount {
  private userRepository: UserRepository;
  private comparePassword: ComparePassword
  constructor(userRepository: UserRepository, comparePassword: ComparePassword) {
    this.userRepository = userRepository;
    this.comparePassword = comparePassword
  }
  async verify(
    data: CompulsoryQueryLogin
  ): Promise<boolean> {
    const user = await this.userRepository.find(
      data.email ? { email: data.email } : { username: data.username }
    );
    if (!user) {
      throw new AuthenticationError("authentication error");
    }
    const isValid = await this.comparePassword.compareHash(data.password, user.password)
    
    if(!isValid) {
      throw new AuthenticationError("authentication error");
    };
    
    return true
  }
}

export default VerifyAccount;
