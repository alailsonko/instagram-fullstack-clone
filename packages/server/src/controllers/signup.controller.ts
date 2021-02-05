interface HttpRequest {
  body: any
}

interface HttpResponse {
  StatusMessage: string
  StatusCode: number
}

interface Controller {
  handle: (req: HttpRequest) => HttpResponse
}

interface AddAccount {
  username: string
  email: string
  password: string
  passwordConfirm: string
}

const MissingParamError = (param: string): HttpResponse => ({
  StatusMessage: `${param} is required`,
  StatusCode: 400
})

export default class SignUpController implements Controller {
  handle (req: HttpRequest): HttpResponse {
    const { username, email, password, passwordConfirm } = req.body as AddAccount
    if (!username) {
      return MissingParamError('username')
    }

    return {
      StatusMessage: 'ok',
      StatusCode: 200
    }
  }
}
