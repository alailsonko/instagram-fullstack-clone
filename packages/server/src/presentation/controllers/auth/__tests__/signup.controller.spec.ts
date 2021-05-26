import SignUpController from '../signup.controller'

describe('SignUp Controller', () => {
  test('should throw error case username is empty', () => {
    const sut = new SignUpController()
    const mutationRequest = {
      body: {
        username: '',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = sut.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'username must be provided' })
  })
  test('should throw error case email is empty', () => {
    const sut = new SignUpController()
    const mutationRequest = {
      body: {
        username: 'valid_user',
        email: '',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = sut.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'email must be provided' })
  })
  test('should throw error case password is empty', () => {
    const sut = new SignUpController()
    const mutationRequest = {
      body: {
        username: 'valid_user',
        email: 'valid_email@example.com',
        password: '',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = sut.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'password must be provided' })
  })
  test('should throw error case passwordConfirmation is empty', () => {
    const sut = new SignUpController()
    const mutationRequest = {
      body: {
        username: 'valid_user',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: ''
      }
    }
    const response = sut.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'passwordConfirmation must be provided' })
  })
})
