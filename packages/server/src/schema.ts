import { gql } from 'apollo-server'

const typeDefs = gql`
  
    type Query { 
        helloworld: String!
    }
`

export default typeDefs
