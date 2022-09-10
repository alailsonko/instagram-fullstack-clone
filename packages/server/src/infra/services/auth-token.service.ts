import { randomUUID } from 'crypto'
import * as JWT from 'jsonwebtoken'
import UserRepository from '../repositories/users/users.repositories'
import { isBefore } from 'date-fns'
import { AuthenticationError } from 'apollo-server'

type Sub = {
  idSerial: number
  email: string
  username: string
  id: string
}

export type JWTResponse = Sub & JWT.JwtPayload

interface IAuthToken {
  generate(data: object): Promise<string>
  verify(data: string): Promise<string | JWTResponse>
}

class AuthToken implements IAuthToken {
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }
  async generate(data: Sub): Promise<string> {
    const timestamp = +new Date()
    this.userRepository.update(
      {
        idSerial: data.idSerial,
      },
      {
        lastTimeLogged: `${timestamp}`,
      }
    )
    return JWT.sign(data, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
      jwtid: `${timestamp}.${randomUUID()}`,
    })
  }
  async verify(data: string): Promise<string | JWTResponse> {
    try {
      const response = JWT.verify(data, process.env.JWT_SECRET as string) as JWTResponse | string

      if (typeof response !== 'string' && response.id && response.jti) {
        const user = await this.userRepository.find({
          idSerial: response.idSerial,
        })
        const [timestamp] = response.jti.split('.')
        if (user && user.lastTimeLogged) {
          if (isBefore(new Date(parseInt(timestamp)), new Date(parseInt(user.lastTimeLogged)))) {
            throw new AuthenticationError('token invalid make logging again.')
          }
        }
      }
      return response
    } catch (error: any) {
      return error.message
    }
  }
}

export default AuthToken
