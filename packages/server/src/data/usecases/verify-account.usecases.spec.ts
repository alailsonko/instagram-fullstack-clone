import { AuthenticationError } from "apollo-server"
import { createMockContext } from "../../infra/context"
import UserRepository from "../../infra/repositories/users/users.repositories"
import VerifyAccount from "./verify-account.usecases"

describe('VerifyAccount', () => {
  test('should throw error case user is not found', async () => {
    const mockPrisma = createMockContext()
    const userRepository = new UserRepository(mockPrisma.prisma)
    jest.spyOn(userRepository, 'find').mockResolvedValueOnce(null)
    const verifyAccount = new VerifyAccount(userRepository)
    await expect(
      () => verifyAccount.verify({
        email: 'valid_mail@mail.com',
        username: 'valid_mail',
      })
    ).rejects.toThrow(new AuthenticationError('authentication error'))
  })
})
