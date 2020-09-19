import { Controller } from '../../protocols/Controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'

const httpErrorHelper = (error: string, status: number): HttpResponse => {
  return {
    statusCode: status,
    body: { message: new Error(`invalid ${error}`) }
  }
}

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accountData = ['email', 'username', 'password', 'passwordConfirm']

    for (const i of accountData) {
      if (!httpRequest.body[i]) {
        return httpErrorHelper(i, 400)
      }
    }

    if (httpRequest.body.password !== httpRequest.body.passwordConfirm) {
      return httpErrorHelper('password does not match', 500)
    }
  }
}
