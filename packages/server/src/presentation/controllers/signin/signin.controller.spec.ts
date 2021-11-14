import SignInController from './signin.controller'
import { QueryLoginArgs } from '../../../main/graphql/generated'
import { ContextGraphQL } from '../../../domain/auth/context'
import { UserInputError } from 'apollo-server'

describe('SignInController', () => {
  test('should throw error case username and email is missing', async () => {
    const signinController = new SignInController()

    const fakeAccount: QueryLoginArgs = {
       password: '1234',
       email: '',
       username: ''
    }
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
    };

    await expect(
      async () =>
        await signinController.handle(fakeAccount, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError("email or username must not be empty."));
  })
  test('should throw error case password is empty', async () => {
    const signinController = new SignInController()

    const fakeAccount: QueryLoginArgs = {
       password: '',
       email: 'valid@mail.com',
       username: ''
    }
    const fakeContextGraphQL: ContextGraphQL = {
      token: "bearer somtoken",
    };

    await expect(
      async () =>
        await signinController.handle(fakeAccount, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError("password must not be empty."));
  })
})
