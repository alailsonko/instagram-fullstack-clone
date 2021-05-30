import Controller from '../../protocols/controller.protocol'
import { ErrorResponse, OkResponse, IMutationRequest } from '../../protocols/http.protocol'
import ISlugifyValidator from './../../protocols/slugify.protocol'
import IEmailValidator from './../../protocols/email-validator.protocol'

class SignUpController implements Controller {
  private readonly slugifyValidator
  private readonly emailValidator
  constructor (
    slugifyValidator: ISlugifyValidator,
    emailValidator: IEmailValidator
  ) {
    this.slugifyValidator = slugifyValidator
    this.emailValidator = emailValidator
  }

  handle (mutationRequest: IMutationRequest): ErrorResponse | OkResponse {
    const fields: string[] = ['username', 'email', 'password', 'passwordConfirmation']
    const data = mutationRequest.body
    for (const field of fields) {
      if (!data[field]) {
        return { error: `${field} must be provided` }
      }
    }
    if (!this.emailValidator.isValid(data.email)) {
      return { error: 'email must be valid' }
    }
    data.username = this.slugifyValidator.handle(data.username)
    return {
      ok: 'User created successfully',
      message: {
        username: data.username,
        email: data.email
      }
    }
  }
}

export default SignUpController
