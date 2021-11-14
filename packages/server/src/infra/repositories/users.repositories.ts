import { Prisma, PrismaClient, User } from '@prisma/client'
import { ApolloError } from 'apollo-server-express';

class UserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  async find(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where 
    }).catch((error: Error) => {
      throw new ApolloError(error.message)
    })
  }
  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data
    }).catch((error: Error) => {
      throw new ApolloError(error.message)
    })
  }
}

export default UserRepository
