import { IResolvers } from 'graphql-tools'

const resolvers: IResolvers = {
  Query: {
    users: (): any => {
      return [
        { id: '1', username: 'user', email: 'user@example.com' }
      ]
    },
    user: (_, { id }: any) => {
      console.log(id)
      return { id: '1', username: 'user', email: 'user@example.com' }
    }
  },

  Mutation: {
    createUser: (_, user: any) => {
      console.log(user)
      return { id: '1', username: 'user', email: 'user@example.com' }
    }
  }
}

export default resolvers
