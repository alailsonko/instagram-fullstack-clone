import UserRepository from "../repositories/users/users.repositories"
import AuthToken from "../services/auth-token.service"

interface IAuthorization {
  isLogged(token: string): Promise<boolean>
}

class Authorization implements IAuthorization {
  private userRepository: UserRepository
  private authToken: AuthToken
  constructor(userRepository: UserRepository, authToken: AuthToken) {
    this.userRepository = userRepository,
    this.authToken = authToken
  }
  async isLogged(token: string): Promise<boolean> {
    const decode = await this.authToken.verify(token)
    if(typeof decode === 'string') {
      return false
    }
    const user = await this.userRepository.find({
      id: decode.id
    })
    return user?.id === decode.id
  }
}

export default Authorization
