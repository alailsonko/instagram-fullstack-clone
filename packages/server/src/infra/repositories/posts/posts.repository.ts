import { Prisma, PrismaClient } from '@prisma/client'

class PostRepository {
  private prisma: PrismaClient
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }
  async create(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({
      data,
      include: {
        user: {
          select: {
            createdAt: true,
            email: true,
            idSerial: true,
            password: false,
            id: true,
            username: true,
            updatedAt: true,
          },
        },
        medias: true,
      },
    })
  }
  async find(where: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.findUnique({
      where,
      include: {
        medias: true,
        user: true,
      },
    })
  }
  async findAll() {
    return this.prisma.post.findMany({
      include: {
        user: true,
        medias: true,
      },
    })
  }
  async findMany(where: Prisma.PostWhereInput) {
    return this.prisma.post.findMany({
      where,
      include: {
        user: true,
        medias: true,
      },
    })
  }
}

export default PostRepository
