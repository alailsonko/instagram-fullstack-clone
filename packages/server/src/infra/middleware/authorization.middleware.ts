import UserRepository from "../repositories/users/users.repositories"
import AuthToken, { JWTResponse } from "../services/auth-token.service"

interface IAuthorization {
  isLogged(token: string): Promise<[boolean , string | JWTResponse | null]>
}

class Authorization implements IAuthorization {
  private userRepository: UserRepository
  private authToken: AuthToken
  constructor(userRepository: UserRepository, authToken: AuthToken) {
    this.userRepository = userRepository,
    this.authToken = authToken
  }
  async isLogged(token: string): Promise<[boolean , string | JWTResponse | null]> {
    const decode = await this.authToken.verify(token)
    if(typeof decode === 'string') {
      return [false, decode]
    }
    const user = await this.userRepository.find({
      id: decode.id
    })
    if(!user) {
      return [false, user]
    }
    return [user?.id === decode.id, decode]
  }
}

export default Authorization
