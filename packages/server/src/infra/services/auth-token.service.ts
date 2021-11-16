import { randomUUID } from 'crypto'
import * as JWT from 'jsonwebtoken'

type Sub = {
  id: number,
  email: string,
  username: string,
  uuid: string,
}

type JWTResponse = Sub & JWT.JwtPayload

interface IAuthToken {
  generate(data: object): Promise<string> 
  verify (data: string): Promise<string | JWTResponse> 
} 

class AuthToken implements IAuthToken {
 async generate(data: Sub): Promise<string> {
      return JWT.sign(data, process.env.JWT_SECRET as string, {
        expiresIn: '1d',
        jwtid: randomUUID()
      })
  }
  async verify(data: string): Promise<string | JWTResponse> {
    return JWT.verify(data, process.env.JWT_SECRET as string) as JWTResponse | string
  }
}

export default AuthToken
