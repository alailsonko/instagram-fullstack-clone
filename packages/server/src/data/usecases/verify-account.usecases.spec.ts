import { AuthenticationError } from "apollo-server";
import { createMockContext } from "../../infra/context";
import ComparePassword from "../../infra/cryptography/compare-password.cryptography";
import UserRepository from "../../infra/repositories/users/users.repositories";
import VerifyAccount from "./verify-account.usecases";

describe("VerifyAccount", () => {
  test("should throw error case user is not found", async () => {
    const mockPrisma = createMockContext();
    const userRepository = new UserRepository(mockPrisma.prisma);
    jest.spyOn(userRepository, "find").mockResolvedValueOnce(null);
    const comparePassword = new ComparePassword();
    const verifyAccount = new VerifyAccount(userRepository, comparePassword);
    expect(
      await verifyAccount.verify({
        uniqueIdentifier: "valid_mail|username",
        password: "12345",
      })
    ).toStrictEqual([false, null]);
  });
  test("should throw error case user is not found", async () => {
    const mockPrisma = createMockContext();
    const userRepository = new UserRepository(mockPrisma.prisma);
    jest.spyOn(userRepository, "find").mockResolvedValueOnce({
      id: 1,
      email: "valid@mail.com",
      uuid: "1234-abcd",
      createdAt: new Date(),
      updatedAt: new Date(),
      password: "1234",
      lastTimeLogged: '123',
      username: "valid_username",
    });
    const comparePassword = new ComparePassword();
    jest.spyOn(comparePassword, "compareHash").mockResolvedValueOnce(false);
    const verifyAccount = new VerifyAccount(userRepository, comparePassword);
    expect(
      await verifyAccount.verify({
        uniqueIdentifier: "valid_mail|username",
        password: "12345",
      })
    ).toStrictEqual([false, null]);
  });
});
