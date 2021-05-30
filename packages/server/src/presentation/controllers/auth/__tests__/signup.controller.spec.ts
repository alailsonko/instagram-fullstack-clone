import SignUpController from '../signup.controller'
import SlugifyValidatorAdapter from '../../../../utils/slugify.adapter'

interface typeSut {
  slugify: SlugifyValidatorAdapter
  signup: SignUpController
}

function makeSut (): typeSut {
  const slugify = new SlugifyValidatorAdapter()
  const signup = new SignUpController(slugify)

  return {
    slugify,
    signup
  }
}

describe('SignUp Controller', () => {
  test('should throw error case username is empty', () => {
    const sut = makeSut()
    const mutationRequest = {
      body: {
        username: '',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = sut.signup.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'username must be provided' })
  })
  test('should throw error case email is empty', () => {
    const sut = makeSut()
    const mutationRequest = {
      body: {
        username: 'valid_user',
        email: '',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = sut.signup.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'email must be provided' })
  })
  test('should throw error case password is empty', () => {
    const sut = makeSut()
    const mutationRequest = {
      body: {
        username: 'valid_user',
        email: 'valid_email@example.com',
        password: '',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = sut.signup.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'password must be provided' })
  })
  test('should throw error case passwordConfirmation is empty', () => {
    const sut = makeSut()
    const mutationRequest = {
      body: {
        username: 'valid_user',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: ''
      }
    }
    const response = sut.signup.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'passwordConfirmation must be provided' })
  })
  test('should slugify username', () => {
    const sut = makeSut()
    const mutationRequest = {
      body: {
        username: 'valid user',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = sut.slugify.handle(mutationRequest.body.username)
    expect(response).toStrictEqual('valid_user')
  })
  test('should response ok case everything is ok', () => {
    const sut = makeSut()
    const mutationRequest = {
      body: {
        username: 'valid user',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const expected = {
      ok: 'User created successfully',
      message: {
        username: 'valid_user',
        email: 'valid_email@example.com'
      }
    }

    const response = sut.signup.handle(mutationRequest)
    expect(response).toStrictEqual(expected)
  })
  // test('should throw error case email in. invalid', () => {
  //   const sut = makeSut()
  //   const mutationRequest = {
  //     body: {
  //       username: 'valid_user',
  //       email: 'valid_email@example.com',
  //       password: 'valid_password',
  //       passwordConfirmation: 'valid_password'
  //     }
  //   }
  //   const response = sut.signup.handle(mutationRequest)
  //   expect(response).toStrictEqual({ error: 'passwordConfirmation must be provided' })
  // })
})
