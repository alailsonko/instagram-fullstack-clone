import AccountPGRepository from './account'
import { Context, MockContext, createMockContext } from '../context'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = (mockCtx as unknown) as Context
})

const makeSut = (): AccountPGRepository => {
  return new AccountPGRepository(ctx)
}

describe('Account PG Repository', () => {
  test('should return an account on success', async () => {
    const sut = makeSut()
    const account = {
      username: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    mockCtx.prisma.user.create.mockResolvedValue(account)
    const resolved = await sut.add(account)
    console.log(resolved)
    expect(resolved).toEqual({
      username: 'any_name',
      // id: 1,
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})
