import bcrypt from 'bcrypt'

interface IHashPassword {
  encrypt(data: string): Promise<string>
}

class HashPassword implements IHashPassword {
  async encrypt(data: string): Promise<string> {
    return await bcrypt.hash(data, 12)
  }
} 

export default HashPassword
