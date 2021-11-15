import { Prisma } from "@prisma/client";
import { createMockContext } from "../../context";
import PostRepository from "./posts.repository";

const resolvedPostCreated = {
  id: 1,
  description: "some descrion",
  user: [
    {
      id: 1,
    },
  ],
  medias: [
    {
      id: 1,
      url: "http://image.com",
    },
  ],
  createdAt: new Date("2021-11-15T00:55:59.742Z"),
  updatedAt: new Date("2021-11-15T00:55:59.742Z"),
};

jest.mock("./posts.repository", () => {
  return jest.fn().mockImplementation(() => {
    return {
      create: () => resolvedPostCreated,
      find: () => resolvedPostCreated,
      findMany: () => [resolvedPostCreated],
    };
  });
});

describe("PostRepository", () => {
  test("should create a post", async () => {
    const mockPrisma = createMockContext();
    const postRepository = new PostRepository(mockPrisma.prisma);
    const fakePost = {
      createdAt: new Date(),
      updatedAt: new Date(),
      description: "some description",
      user: {
        connect: {
          id: 1,
        },
      },
      medias: {
        createMany: {
          data: [
            {
              createdAt: new Date(),
              updatedAt: new Date(),
              url: "http://media.com/1",
            },
            {
              createdAt: new Date(),
              updatedAt: new Date(),
              url: "http://media.com/2",
            },
          ],
        },
      },
    } as Prisma.PostCreateInput;
    expect(postRepository.create(fakePost)).toStrictEqual(resolvedPostCreated);
  });
  test("should find a post", async () => {
    const mockPrisma = createMockContext();
    const postRepository = new PostRepository(mockPrisma.prisma);
    const where = {
     id: 1
    } as Prisma.PostWhereUniqueInput;
    expect(postRepository.find(where)).toStrictEqual(resolvedPostCreated);
  });
  test("should findMany a post", async () => {
    const mockPrisma = createMockContext();
    const postRepository = new PostRepository(mockPrisma.prisma);
    const where = {
     id: 1
    } as Prisma.PostWhereInput;
    expect(postRepository.findMany(where)).toStrictEqual([resolvedPostCreated]);
  });
});
