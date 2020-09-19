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
  test('should return 400 if email is not provided', async () => {
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const sut = new SignUpController()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toEqual(new Error('invalid email'))
  })
  test('should return 400 if password is not provided', async () => {
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const sut = new SignUpController()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toEqual(new Error('invalid password'))
  })
  test('should return 400 if passwordConfirm is not provided', async () => {
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const sut = new SignUpController()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toEqual(
      new Error('invalid passwordConfirm')
    )
  })
})
