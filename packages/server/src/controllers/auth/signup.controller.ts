
interface Controller {
  handle: (data: any) => any
}

class SignUpController implements Controller {
  handle (data: any): any {
    return 'ok'
  }
}

export default SignUpController
