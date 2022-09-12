/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Prisma, PrismaClient } from '@prisma/client'
import { ApolloError } from 'apollo-server-express'

class UserRepository {
  private prisma: PrismaClient
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async find(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user
      .findUnique({
        where,
      })
      .catch((error: Error) => {
        throw new ApolloError(error.message)
      })
  }

  async findProfile(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user
      .findUnique({
        where,
      })
      .catch((error: Error) => {
        throw new ApolloError(error.message)
      })
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user
      .create({
        data,
      })
      .catch((error: Error) => {
        throw new ApolloError(error.message)
      })
  }

  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    return await this.prisma.user
      .update({
        data,
        where,
      })
      .catch((error: Error) => {
        throw new ApolloError(error.message)
      })
  }
}

export default UserRepository
