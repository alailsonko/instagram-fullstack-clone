import { Prisma } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { O } from "ts-toolbelt";
import UserRepository from "../../infra/repositories/users/users.repositories";
import { QueryLoginArgs } from "../../main/graphql/generated";

type CompulsoryQueryLogin = O.Compulsory<QueryLoginArgs, "email" | 'username'>

interface IVerifyAccount {
  verify(data: O.Optional<CompulsoryQueryLogin, 'password'>): Promise<boolean>
}


class VerifyAccount implements IVerifyAccount {
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }
  async verify(data: O.Optional<CompulsoryQueryLogin, 'password'>): Promise<boolean> {
  const user = await this.userRepository.find({
    email: data.email,
    username: data.username
  })
  if(!user) {
    throw new AuthenticationError('authentication error')
  }

  return true
  }
}

export default VerifyAccount
