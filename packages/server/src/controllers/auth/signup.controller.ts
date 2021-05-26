
interface Controller {
  handle: (data: any) => any
}

interface AddAccount {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

interface ErrorResponse {
  error: string
}

interface OkResponse {
  ok: string
}

class SignUpController implements Controller {
  handle (data: AddAccount): ErrorResponse | OkResponse {
    const { username, email, password, passwordConfirmation } = data
    if (!username) {
      return { error: 'username must be provided' }
    }
    if (!email) {
      return { error: 'email must be provided' }
    }
    if (!password) {
      return { error: 'password must be provided' }
    }
    if (!passwordConfirmation) {
      return { error: 'passwordConfirmation must be provided' }
    }
    return { ok: 'User succesfull created' }
  }
}

export default SignUpController
