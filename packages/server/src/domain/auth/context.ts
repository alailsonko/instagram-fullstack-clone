import { PubSub } from 'graphql-subscriptions'
import { JWTResponse } from '../../infra/services/auth-token.service'

export interface ContextGraphQL {
  token: string
  pubsub: PubSub
  isLogged: boolean
  user: JWTResponse | null | string
}
