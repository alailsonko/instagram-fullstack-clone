import { SignUpController } from './SignUpController'

describe('SignUpController', () => {
  test('should return 400 if name is not provided', async () => {
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const sut = new SignUpController()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toEqual(new Error('invalid username'))
  })
})