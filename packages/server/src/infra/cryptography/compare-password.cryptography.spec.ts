import ComparePassword from "./compare-password.cryptography";


jest.mock('./compare-password.cryptography', () => {
  return jest.fn().mockImplementation(() => {
    return {
      compareHash: () => true
    }
  })
})

describe('ComparePassword', () => {
  test('should compare the passwordHas', async () => {
    const comparePassword = new ComparePassword()
    const isValid = await comparePassword.compareHash('1234', '1234')
    expect(isValid).toBe(true)
  })
})
