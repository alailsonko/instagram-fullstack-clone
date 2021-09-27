import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import schema from './graphql/schemasMap'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const server = new ApolloServer({
  schema
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`)
})
