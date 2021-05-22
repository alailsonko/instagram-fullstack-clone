import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import compression from 'compression'
import cors from 'cors'
import typeDefs from './schema'
import resolvers from './resolver'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)]
})

app.use(cors({
  origin: '*'
}))
app.use(compression())
server.applyMiddleware({ app, path: '/graphql' })

const PORT = process.env.PORT

app.listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
)
