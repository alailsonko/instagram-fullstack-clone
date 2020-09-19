import { Controller } from '../../protocols/Controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.username) {
      const { statusCode, body } = {
        statusCode: 400,
        body: { message: new Error('invalid username') }
      }
      return {
        statusCode,
        body
      }
    }

    if (!httpRequest.body.email) {
      const { statusCode, body } = {
        statusCode: 400,
        body: { message: new Error('invalid email') }
      }
      return {
        statusCode,
        body
      }
    }
  }
}
