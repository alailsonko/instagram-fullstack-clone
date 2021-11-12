import SignUpController from './signup.controller'
import { MutationRegisterArgs } from '../../main/graphql/generated'
import { ContextGraphQL } from '../../domain/auth/context'
import { UserInputError, AuthenticationError } from 'apollo-server'

describe('SignUpController', () => {
  test('should throw error case has no email field', async () => {
    const signupController = new SignUpController()

    const fakeUserRegister: MutationRegisterArgs = {
      email: '',
      password: '1234',
      passwordConfirm: '1234',
      username: 'test'
    }
    const fakeContextGraphQL: ContextGraphQL = {
      token: 'bearer somtoken'
    }
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError('email must not be empty.'))
  })
  test('should throw error case has no username field', async () => {
    const signupController = new SignUpController()

    const fakeUserRegister: MutationRegisterArgs = {
      email: 'test@test.com',
      password: '1234',
      passwordConfirm: '1234',
      username: ''
    }
    const fakeContextGraphQL: ContextGraphQL = {
      token: 'bearer somtoken'
    }
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError('username must not be empty.'))
  })
  test('should throw error case has no password field', async () => {
    const signupController = new SignUpController()

    const fakeUserRegister: MutationRegisterArgs = {
      email: 'test@test.com',
      password: '',
      passwordConfirm: '1234',
      username: 'test'
    }
    const fakeContextGraphQL: ContextGraphQL = {
      token: 'bearer somtoken'
    }
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError('password must not be empty.'))
  })
  test('should throw error case has no passwordConfirm field', async () => {
    const signupController = new SignUpController()

    const fakeUserRegister: MutationRegisterArgs = {
      email: 'test@test.com',
      password: '1234',
      passwordConfirm: '',
      username: 'test'
    }

    const fakeContextGraphQL: ContextGraphQL = {
      token: 'bearer somtoken'
    }
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new UserInputError('passwordConfirm must not be empty.'))
  })
  test('should throw error case password and passwordConfirm not matches', async () => {
    const signupController = new SignUpController()

    const fakeUserRegister: MutationRegisterArgs = {
      email: 'test@test.com',
      password: '1234',
      passwordConfirm: '12345',
      username: 'test'
    }
    
    const fakeContextGraphQL: ContextGraphQL = {
      token: 'bearer somtoken'
    }
    await expect(
      async () =>
        await signupController.handle(fakeUserRegister, fakeContextGraphQL)
    ).rejects.toThrow(new AuthenticationError('authentication error.'))
  })
})
