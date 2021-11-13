import { Prisma, User } from '@prisma/client'
import AddAccount from './add-account.usecases'
import HashPassword from '../../infra/cryptography/hash-password.cryptography'
import UserRepository from '../../infra/repositories/users.repositories'
import { createMockContext } from '../../infra/context'

describe('AddAccount', () => {
  test('should create a new account', async () => {
    const fakeAccount: Prisma.UserCreateInput = {
      email: 'valid_email@mail.com',
      username: 'valid_username',
      password: '1234',
      createdAt: new Date(),
      updatedAt: new Date(),
    }    
    const resolvedAccount = {
      email: 'valid_email@mail.com',
      username: 'valid_username',
      uuid: '1234-1234',
      password: '1234',
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const expectedAccount = {
      email: 'valid_email@mail.com',
      username: 'valid_username',
      uuid: '1234-1234',
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const hashPassword = new HashPassword()
    const mockPrisma = createMockContext()
    const userRepository = new UserRepository(mockPrisma.prisma)
    const addAccount = new AddAccount(hashPassword, userRepository) 
    jest.spyOn(hashPassword, 'encrypt').mockResolvedValueOnce(new Promise((resolve, reject) => resolve('1234')))
    mockPrisma.prisma.user.create.mockResolvedValue(resolvedAccount)

    expect(await addAccount.add(fakeAccount)).toStrictEqual(expectedAccount)

  });
})
