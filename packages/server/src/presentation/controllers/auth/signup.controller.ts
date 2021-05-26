import Controller from '../../protocols/controller.protocol'
import { ErrorResponse, OkResponse } from '../../protocols/http.protocol'

interface IMutationRequest {
  body?: any
}

class SignUpController implements Controller {
  handle (mutationRequest: IMutationRequest): ErrorResponse | OkResponse {
    const fields: string[] = ['username', 'email', 'password', 'passwordConfirmation']

    for (const field of fields) {
      if (!mutationRequest.body[field]) {
        return { error: `${field} must be provided` }
      }
    }
    return { ok: 'User succesfull created' }
  }
}

export default SignUpController
