import { gql } from 'apollo-server'

const typeDefs = gql`
    type User {
      id: ID!
      username: String!
      email: String!
    }

    type Query { 
        users: [User!]!
        user(id: ID!): User
    }

    type Mutation {
        createUser(
          username: String!, 
          email: String!, 
          password: String!
          passwordConfirmation: String!
          ): User
    }
`

export default typeDefs
