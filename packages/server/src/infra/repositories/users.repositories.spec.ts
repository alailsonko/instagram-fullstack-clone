import UserRepository from "./users.repositories";
import { createMockContext, MockContext } from "../context";

let mockCtx: MockContext;

beforeEach(() => {
  mockCtx = createMockContext();
});

describe("UserRepository", () => {
  test("should find an unique user", async () => {
    const userRepository = new UserRepository(mockCtx.prisma);
    const resolveUser = {
      id: 1,
      uuid: "123-abc-123-abc",
      email: "valid@mail.com",
      password: "1234abcd",
      username: "valid_mail",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCtx.prisma.user.findUnique.mockResolvedValue(resolveUser);

    expect(resolveUser).toBe(await userRepository.find({ id: 1 }));
  });
  test("should create an user", async () => {
    const userRepository = new UserRepository(mockCtx.prisma);
    const resolveUser = {
      id: 1,
      uuid: "123-abc-123-abc",
      email: "valid@mail.com",
      password: "1234abcd",
      username: "valid_mail",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCtx.prisma.user.create.mockResolvedValue(resolveUser);

    expect(resolveUser).toBe(await userRepository.create(resolveUser));
  });
});
