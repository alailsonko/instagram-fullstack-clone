import { sign } from 'jsonwebtoken'

type Sub = {
  id: number,
  email: string,
  username: string,
  uuid: string,
}

interface IAuthToken {
  generate(data: object): Promise<string> 
} 

class AuthToken implements IAuthToken {
 async generate(data: Sub): Promise<string> {
      return sign(data, process.env.JWT_SECRET as string, {
        expiresIn: '1d'
      })
  }
}

export default AuthToken
