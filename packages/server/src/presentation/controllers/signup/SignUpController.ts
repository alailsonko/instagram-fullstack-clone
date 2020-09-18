import { Controller } from '../../protocols/Controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body.name) {
        const { statusCode, body } = {
          statusCode: 400,
          body: {
            message: new Error('invalid username')
          }
        }
        return {
          statusCode,
          body
        }
      }
    } catch (error) {}
  }
}
