import { Controller } from '../../protocols/Controller.protocol'
import { HttpRequest, HttpResponse } from '../../protocols/http.protocol'
import { AddAccount } from '../../usecases/Account'

class SignUpController implements Controller {
    handle(httpRequest: HttpRequest): HttpResponse {
      
   const { username } = httpRequest.body as AddAccount

    if (!username) {
    return { statusCode: 400, body: { error: `missing param ${username}` }}
    }
    

    return { statusCode: 200, body: { msg: 'working' }}
    }
}

export default SignUpController
