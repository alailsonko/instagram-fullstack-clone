import { Controller } from '../../protocols/Controller.protocol'
import { HttpRequest, HttpResponse } from '../../protocols/http.protocol'
import { AccountModel } from '../../usecases/AccountModel'

class SignUpController implements Controller {
     handle(httpRequest: HttpRequest): HttpResponse {
      
   const { username } = httpRequest.body as AccountModel


    if (!username) {
    return { statusCode: 400, body: { error: `missing param ${username}` }}
    }

    return { statusCode: 200, body: { msg: 'working' }}
    }
}

export default SignUpController
