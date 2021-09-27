import { IResolvers } from 'graphql-tools'
import {
  AuthenticateResponse,
  MutationRegisterArgs,
  QueryLoginArgs
} from '../generated'

export const UserResolvers: IResolvers = {
  Query: {
    async login (
      _: undefined,
      args: QueryLoginArgs
    ): Promise<AuthenticateResponse> {
      return {
        user: {
          email: 'admin@admin.com',
          id: '1',
          username: 'admin'
        },
        token: 'sometoken'
      }
    }
  },
  Mutation: {
    async register (
      _: undefined,
      args: MutationRegisterArgs
    ): Promise<AuthenticateResponse> {
      return {
        user: {
          email: 'admin@admin.com',
          id: '1',
          username: 'admin'
        },
        token: 'sometoken'
      }
    }
  }
}
