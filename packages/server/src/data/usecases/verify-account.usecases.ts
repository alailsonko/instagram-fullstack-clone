import { Prisma, User } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { O } from "ts-toolbelt";
import ComparePassword from "../../infra/cryptography/compare-password.cryptography";
import UserRepository from "../../infra/repositories/users/users.repositories";
import { QueryLoginArgs } from "../../main/graphql/generated";

type CompulsoryQueryLogin = O.Compulsory<
  { uniqueIdentifier: string; password: string },
  "uniqueIdentifier" | "password"
>;

interface IVerifyAccount {
  verify(data: CompulsoryQueryLogin): Promise<[boolean, O.Optional<User, "password"> | null]>;
}

class VerifyAccount implements IVerifyAccount {
  private userRepository: UserRepository;
  private comparePassword: ComparePassword;
  constructor(
    userRepository: UserRepository,
    comparePassword: ComparePassword
  ) {
    this.userRepository = userRepository;
    this.comparePassword = comparePassword;
  }
  async verify(
    data: CompulsoryQueryLogin
  ): Promise<[boolean, O.Optional<User, "password"> | null]> {
    const [value, field] = data.uniqueIdentifier.split("|");
    const user = await this.userRepository.find(
      field === "email" ? { [field]: value } : { [field]: value }
    );
    if (!user) {
      return [false, null];
    }
    const isValid = await this.comparePassword.compareHash(
      data.password,
      user.password
    );

    if (!isValid) {
      return [false, null];
    }

    return [true, user];
  }
}

export default VerifyAccount;
