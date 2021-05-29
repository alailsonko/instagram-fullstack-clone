import Controller from '../../protocols/controller.protocol'
import { ErrorResponse, OkResponse, IMutationRequest } from '../../protocols/http.protocol'
import SlugifyValidator from './../../protocols/slugify.protocol'

class SignUpController implements Controller {
  private readonly slugify
  constructor (slugify: SlugifyValidator) {
    this.slugify = slugify
  }

  handle (mutationRequest: IMutationRequest): ErrorResponse | OkResponse {
    const fields: string[] = ['username', 'email', 'password', 'passwordConfirmation']
    const data = mutationRequest.body
    for (const field of fields) {
      if (!data[field]) {
        return { error: `${field} must be provided` }
      }
    }

    return { ok: 'User succesfull created' }
  }
}

export default SignUpController
