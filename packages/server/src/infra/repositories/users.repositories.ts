import { Prisma, PrismaClient, User } from '@prisma/client'

class UserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  find(where: Prisma.UserWhereUniqueInput): Prisma.Prisma__UserClient<User | null> {
    return this.prisma.user.findUnique({
      where 
    })
  }
  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data
    })
  }
}

export default UserRepository
