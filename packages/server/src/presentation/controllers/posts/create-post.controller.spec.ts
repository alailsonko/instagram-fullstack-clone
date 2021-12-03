import { PubSub } from "graphql-subscriptions";
import { FileUpload } from "graphql-upload";
import { createMockContext } from "../../../infra/context";
import PostRepository from "../../../infra/repositories/posts/posts.repository";
import CreatePostController from "./create-post.controller";

describe("CreatePostController", () => {
  test("should create a post", async () => {
    const mockReadStream = {
      pipe: jest.fn(),
    };
    const mockFile: FileUpload[] = [
      {
        filename: "zoro",
        mimetype: "image/jpeg",
        encoding: "7bit",
        createReadStream: jest.fn().mockReturnValueOnce(mockReadStream),
      },
    ];

    const mockedPrisma = createMockContext();
    const postRepository = new PostRepository(mockedPrisma.prisma);
    jest.spyOn(postRepository, "create").mockResolvedValueOnce({
      createdAt: new Date("2021-11-17T23:39:48.875Z"),
      updatedAt: new Date("2021-11-17T23:39:48.875Z"),
      description: "some description",
      uuid: "some-uuid",
      id: 1,
      medias: [
        {
          createdAt: new Date("2021-11-17T23:39:48.875Z"),
          id: 1,
          postId: 1,
          updatedAt: new Date("2021-11-17T23:39:48.875Z"),
          url: "filename.jpeg",
          uuid: "abcd-1234",
        },
      ],
      user: {
        createdAt: new Date("2021-11-17T23:39:48.875Z"),
        email: "valid@mail.com",
        id: 1,
        updatedAt: new Date("2021-11-17T23:39:48.875Z"),
        username: "valid_usernmae",
        uuid: "abcd-1234",
      },
      userId: 1,
    });
    const createPostController = new CreatePostController(postRepository);
    const response = await createPostController.handle(
      {
        description: "some description",
        file: mockFile,
      },
      {
        isLogged: true,
        pubsub: new PubSub(),
        token: "abcd-1234",
        user: {
          email: "valid@mail.com",
          id: 1,
          username: "valid_username",
          uuid: "1234-abcd",
        },
      }
    );

    expect(response).toStrictEqual({
      createdAt: new Date("2021-11-17T23:39:48.875Z"),
      updatedAt: new Date("2021-11-17T23:39:48.875Z"),
      description: "some description",
      id: 1,
      medias: [
        {
          createdAt: new Date("2021-11-17T23:39:48.875Z"),
          id: 1,
          postId: 1,
          updatedAt: new Date("2021-11-17T23:39:48.875Z"),
          url: "filename.jpeg",
          uuid: "abcd-1234",
        },
      ],
      user: {
        createdAt: new Date("2021-11-17T23:39:48.875Z"),
        email: "valid@mail.com",
        id: 1,
        updatedAt: new Date("2021-11-17T23:39:48.875Z"),
        username: "valid_usernmae",
        uuid: "abcd-1234",
      },
      userId: 1,
      uuid: "some-uuid",
    });
  });
});
