import SignInController from "./signin.controller";
import { QueryLoginArgs } from "../../../main/graphql/generated";
import { ContextGraphQL } from "../../../domain/auth/context";
import { AuthenticationError, UserInputError } from "apollo-server";
import VerifyAccount from "../../../data/usecases/verify-account.usecases";
import ComparePassword from "../../../infra/cryptography/compare-password.cryptography";
import UserRepository from "../../../infra/repositories/users/users.repositories";
import { createMockContext } from "../../../infra/context";
import AuthToken from "../../../infra/services/auth-token.service";
import { PubSub } from "graphql-subscriptions";

describe("SignInController", () => {
  test("should throw error case username and email is missing", async () => {
    const comparePassword = new ComparePassword();
    const mockPrisma = createMockContext();
    const userRepository = new UserRepository(mockPrisma.prisma);
    const verifyAccount = new VerifyAccount(userRepository, comparePassword);
    const authToken = new AuthToken(userRepository);
    const signinController = new SignInController(verifyAccount, authToken);

    const fakeAccount: QueryLoginArgs = {
      password: "1234",
      email: "",
      username: "",
    };
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
      pubsub: new PubSub(),
      isLogged: false,
      user: null,
    };

    await expect(
      async () => await signinController.handle(fakeAccount, fakeContextGraphQL)
    ).rejects.toThrow(
      new UserInputError("email or username must not be empty.")
    );
  });
  test("should throw error case password is empty", async () => {
    const comparePassword = new ComparePassword();
    const mockPrisma = createMockContext();
    const userRepository = new UserRepository(mockPrisma.prisma);
    const verifyAccount = new VerifyAccount(userRepository, comparePassword);
    const authToken = new AuthToken(userRepository);
    const signinController = new SignInController(verifyAccount, authToken);

    const fakeAccount: QueryLoginArgs = {
      password: "",
      email: "valid@mail.com",
      username: "",
    };
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
      pubsub: new PubSub(),
      isLogged: false,
      user: null,
    };

    await expect(
      async () => await signinController.handle(fakeAccount, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError("password must not be empty."));
  });
  test("should throw error case password is empty", async () => {
    const comparePassword = new ComparePassword();
    const mockPrisma = createMockContext();
    const userRepository = new UserRepository(mockPrisma.prisma);
    const verifyAccount = new VerifyAccount(userRepository, comparePassword);
    jest.spyOn(verifyAccount, "verify").mockResolvedValueOnce([false, null]);
    const authToken = new AuthToken(userRepository);
    const signinController = new SignInController(verifyAccount, authToken);

    const fakeAccount: QueryLoginArgs = {
      password: "1234",
      email: "valid@mail.com",
      username: "",
    };
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
      pubsub: new PubSub(),
      isLogged: false,
      user: null,
    };

    await expect(
      async () => await signinController.handle(fakeAccount, fakeContextGraphQL)
    ).rejects.toThrow(new AuthenticationError("authentication error."));
  });
  test("should throw error case password is empty", async () => {
    const comparePassword = new ComparePassword();
    const mockPrisma = createMockContext();
    const userRepository = new UserRepository(mockPrisma.prisma);
    const verifyAccount = new VerifyAccount(userRepository, comparePassword);
    jest.spyOn(verifyAccount, "verify").mockResolvedValueOnce([
      true,
      {
        createdAt: new Date("2021-11-14T19:39:14.158Z"),
        updatedAt: new Date("2021-11-14T19:39:14.158Z"),
        email: "valid@mail.com",
        id: 1,
        password: "1234",
        username: "valid_username",
        lastTimeLogged: "1234",
        uuid: "1234-Abcd",
      },
    ]);
    const authToken = new AuthToken(userRepository);
    jest.spyOn(authToken, "generate").mockResolvedValueOnce("1234");
    const signinController = new SignInController(verifyAccount, authToken);

    const fakeAccount: QueryLoginArgs = {
      password: "1234",
      email: "valid@mail.com",
      username: "",
    };
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
      pubsub: new PubSub(),
      isLogged: false,
      user: null,
    };

    expect(
      await signinController.handle(fakeAccount, fakeContextGraphQL)
    ).toStrictEqual({
      token: "1234",
      user: {
        createdAt: new Date("2021-11-14T19:39:14.158Z"),
        updatedAt: new Date("2021-11-14T19:39:14.158Z"),
        email: "valid@mail.com",
        id: 1,
        lastTimeLogged: "1234",
        username: "valid_username",
        uuid: "1234-Abcd",
      },
    });
  });
});
