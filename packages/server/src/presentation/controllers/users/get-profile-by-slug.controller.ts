import { UserInputError, ApolloError } from 'apollo-server-express'
import { ContextGraphQL } from '../../../domain/auth/context'
import UserRepository from '../../../infra/repositories/users/users.repositories'
import { JWTResponse } from '../../../infra/services/auth-token.service'
import { QueryGetProfileBySlugArgs, User } from '../../../main/graphql/generated'
import { Controller } from '../controller.protocol'

export interface ContextGraphQLogged extends Omit<ContextGraphQL, 'user'> {
  user: JWTResponse
}

class GetProfileBySlugController
  implements Controller<User, QueryGetProfileBySlugArgs, ContextGraphQLogged>
{
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async handle(req: QueryGetProfileBySlugArgs, res: ContextGraphQLogged): Promise<User> {
    const { username } = req
    if (!username) {
      throw new UserInputError('Username is required.')
    }
    const user = await this.userRepository.findProfile({
      username,
    })

    if (!user) {
      throw new ApolloError('Profile not found.')
    }

    return user
  }
}

export default GetProfileBySlugController
