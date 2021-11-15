import { Prisma, PrismaClient } from "@prisma/client";

class PostRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async create(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({
      data,
      include: {
        user: true,
        medias: true,
      },
    });
  }
  async find(where: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.findUnique({
      where,
      include: {
        medias: true,
        user: true,
      },
    });
  }
  async findMany(where: Prisma.PostWhereInput) {
    return this.prisma.post.findMany({
      where,
      include: {
        user: true,
        medias: true
      }
    })
  }
}

export default PostRepository;
