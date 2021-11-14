import { compare } from 'bcrypt'

interface IComparePassword {
  compareHash(password: string, hashedPassword: string): Promise<boolean>
}

class ComparePassword implements IComparePassword {
  async compareHash(password: string, hashedPassword: string): Promise<boolean> {
      return await compare(password, hashedPassword)
  }
}

export default ComparePassword
