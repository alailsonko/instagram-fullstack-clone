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
    expect(response).toBe({ error: 'Invalid username' })
  })
})
