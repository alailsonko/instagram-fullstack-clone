import SignUpController from '../signup.controller'

describe('SignUp Controller', () => {
  test('should throw error case username is empty', () => {
    const sut = new SignUpController()
    const user = {
      username: '',
      email: 'valid_email@example.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
    const response = sut.handle(user)
    expect(response).toStrictEqual({ error: 'username must be provided' })
  })
  test('should throw error case email is empty', () => {
    const sut = new SignUpController()
    const user = {
      username: 'valid_username',
      email: '',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
    const response = sut.handle(user)
    expect(response).toStrictEqual({ error: 'email must be provided' })
  })
  test('should throw error case password is empty', () => {
    const sut = new SignUpController()
    const user = {
      username: 'valid_username',
      email: 'valid_email@example.com',
      password: '',
      passwordConfirmation: 'valid_password'
    }
    const response = sut.handle(user)
    expect(response).toStrictEqual({ error: 'password must be provided' })
  })
  test('should throw error case passwordConfirmation is empty', () => {
    const sut = new SignUpController()
    const user = {
      username: 'valid_username',
      email: 'valid_email@example.com',
      password: 'valid_password',
      passwordConfirmation: ''
    }
    const response = sut.handle(user)
    expect(response).toStrictEqual({ error: 'passwordConfirmation must be provided' })
  })
})
