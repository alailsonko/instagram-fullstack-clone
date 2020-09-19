import EmailValidatorAdapter from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator', () => {
  test('should return false if email is invalid', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  test('should return true if email is valid', async () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
  test('should call validator with correct email', async () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
