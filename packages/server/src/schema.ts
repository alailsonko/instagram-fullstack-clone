import { gql } from 'apollo-server'

const typeDefs = gql`
  
    type Query {
        helloworld(hi: String, args: String): String!
    }
`

export default typeDefs
