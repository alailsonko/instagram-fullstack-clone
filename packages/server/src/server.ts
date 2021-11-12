import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import schema from './main/graphql/schemasMap'
import dotenv from 'dotenv'
import { ContextGraphQL } from './domain/auth/context'

dotenv.config()

const app = express()
const server = new ApolloServer({
  schema,
  context: ({ req }): ContextGraphQL => {
    const token = req.headers.authorization ?? ''
    console.log(token)
    return { token }
  }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`)
})
