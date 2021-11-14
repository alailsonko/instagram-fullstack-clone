import SignUpController from "./signup.controller";
import { AuthenticateResponse, MutationRegisterArgs } from "../../main/graphql/generated";
import { ContextGraphQL } from "../../domain/auth/context";
import { UserInputError, AuthenticationError } from "apollo-server";
import AddAccount from "../../data/usecases/add-account.usecases";
import HashPassword from "../../infra/cryptography/hash-password.cryptography";
import UserRepository from "../../infra/repositories/users.repositories";
import { createMockContext } from "../../infra/context";
import AuthToken from "../../infra/services/auth-token.service";
import dotenv from 'dotenv'

dotenv.config()

async function makeSut() {
  const mockPrisma = createMockContext();
  mockPrisma.prisma.user.create.mockResolvedValueOnce(await new Promise((resolve, reject) => resolve({
    id: 1,
    createdAt: new Date('2021-11-13T22:16:33.073Z'),
    updatedAt: new Date('2021-11-13T22:16:33.073Z'),
    email: 'valid_mail@mail.com',
    username: 'valid_username',
    password: '1234',
    uuid: '1234-abcd'
  })))
  const addAccount = new AddAccount(
    new HashPassword(),
    new UserRepository(mockPrisma.prisma)
  );
  const authToken = new AuthToken()
  jest.spyOn(authToken, 'generate').mockResolvedValueOnce('sometoken')
  const signUpController = new SignUpController(addAccount, authToken);
  return {
    signUpController,
    mockPrisma,
    addAccount
  };
}

describe("SignUpController", () => {
  test("should throw error case has no email field", async () => {
    const signupController = (await makeSut()).signUpController;

    const fakeUserRegister: MutationRegisterArgs = {
      email: "",
      password: "1234",
      passwordConfirm: "1234",
      username: "test",
    };
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
    };
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError("email must not be empty."));
  });
  test("should throw error case has no username field", async () => {
    const signupController = (await makeSut()).signUpController;


    const fakeUserRegister: MutationRegisterArgs = {
      email: "test@test.com",
      password: "1234",
      passwordConfirm: "1234",
      username: "",
    };
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
    };
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError("username must not be empty."));
  });
  test("should throw error case has no password field", async () => {
    const signupController = (await makeSut()).signUpController;


    const fakeUserRegister: MutationRegisterArgs = {
      email: "test@test.com",
      password: "",
      passwordConfirm: "1234",
      username: "test",
    };
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
    };
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError("password must not be empty."));
  });
  test("should throw error case has no passwordConfirm field", async () => {
    const signupController = (await makeSut()).signUpController;


    const fakeUserRegister: MutationRegisterArgs = {
      email: "test@test.com",
      password: "1234",
      passwordConfirm: "",
      username: "test",
    };

    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
    };
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError("passwordConfirm must not be empty."));
  });
  test("should throw error case password and passwordConfirm not matches", async () => {
    const signupController = (await makeSut()).signUpController;


    const fakeUserRegister: MutationRegisterArgs = {
      email: "test@test.com",
      password: "1234",
      passwordConfirm: "12345",
      username: "test",
    };

    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
    };
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new AuthenticationError("authentication error."));
  });
  test("should create an user case everything is ok", async () => {
    const signupController = (await makeSut()).signUpController;
    const resolvedValue = {
      id: 1,
      email: 'valid@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'valid_username',
      uuid: '1234-abcd'
    }
    const resolvePrismaValues = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'valid_mail@mail.com',
      username: 'valid_username',
      password: '1234',
      uuid: '1234-abcd'
    }
    ;(await makeSut()).mockPrisma.prisma.user.create.mockResolvedValueOnce(await new Promise((resolve, reject) => resolve(resolvePrismaValues)))
    jest.spyOn((await makeSut()).addAccount, 'add').mockResolvedValueOnce(await new Promise((resolve, reject) => resolve(resolvedValue)))
    
    const fakeUserRegister: MutationRegisterArgs = {
      email: "test@test.com",
      password: "1234",
      passwordConfirm: "1234",
      username: "test",
    };

    const expectedResponse: AuthenticateResponse = {
       token: 'sometoken',
       user: {
         id: 1,
         email: 'valid_mail@mail.com',
         createdAt: new Date('2021-11-13T22:16:33.073Z'),
         updatedAt: new Date('2021-11-13T22:16:33.073Z'),
         username: 'valid_username',
         uuid: '1234-abcd'
       }
    }

    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
    };
    expect(await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).toStrictEqual(expectedResponse);
  });
});
