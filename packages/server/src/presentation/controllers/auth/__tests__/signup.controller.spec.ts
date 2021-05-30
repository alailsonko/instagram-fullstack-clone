import SignUpController from '../signup.controller'
import SlugifyValidatorAdapter from '../../../../utils/slugify.adapter'
import EmailValidatorAdapter from '../../../../utils/email-validator.adapter'

interface typeSut {
  slugifyValidator: SlugifyValidatorAdapter
  emailValidator: EmailValidatorAdapter
  signup: SignUpController
}

function makeSut (): typeSut {
  const slugifyValidator = new SlugifyValidatorAdapter()
  const emailValidator = new EmailValidatorAdapter()
  const signup = new SignUpController(slugifyValidator, emailValidator)

  return {
    slugifyValidator,
    emailValidator,
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
    const response = sut.slugifyValidator.handle(mutationRequest.body.username)
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
  test('should throw error case email invalid', () => {
    const { emailValidator, signup } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const mutationRequest = {
      body: {
        username: 'valid_user',
        email: 'invalid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = signup.handle(mutationRequest)
    expect(response).toStrictEqual({ error: 'email must be valid' })
  })
  test('should call EmailValidator with correct email', () => {
    const { signup, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    const mutationRequest = {
      body: {
        username: 'valid_user',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    signup.handle(mutationRequest)
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@example.com')
  })
})
