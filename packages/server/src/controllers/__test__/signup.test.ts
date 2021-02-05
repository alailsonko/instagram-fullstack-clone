import SignUpController from '../signup.controller'

type HttpResponse = {
  StatusMessage: string;
  StatusCode: number;
}

const MissingParamError = (param: string): HttpResponse => ({
  StatusMessage: `${param} is required`,
  StatusCode: 400
})

describe('SignUpController', () => {
  test('should throw error case username is not provded', () => {
    const HttpRequest = {
      body: {
        username: '',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }
    }
    const sut = new SignUpController()
    const HttpResponse = sut.handle(HttpRequest)
    const expected = MissingParamError('username')

    expect(HttpResponse.StatusCode).toBe(expected.StatusCode)
    expect(HttpResponse.StatusMessage).toBe(expected.StatusMessage)
  });
});
