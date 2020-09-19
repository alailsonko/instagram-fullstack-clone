import { Controller } from '../../protocols/Controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'

const httpErrorHelper = (error: string): HttpResponse => {
  return {
    statusCode: 400,
    body: { message: new Error(`invalid ${error}`) }
  }
}

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accountData = ['email', 'username', 'password', 'passwordConfirm']

    for (const i of accountData) {
      if (!httpRequest.body[i]) {
        return httpErrorHelper(i)
      }
    }
  }
}
