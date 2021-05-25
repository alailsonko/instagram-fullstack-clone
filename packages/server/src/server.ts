import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import schema from './schema'
import { addSchemaLevelResolver } from 'graphql-tools'

dotenv.config()
const rootResolveFunction = (parent: any, args: any, context: any, info: any): any => {
  // perform action before any other resolvers
  console.log(parent)
  console.log(args)
  console.log(context)
  console.log(info)
}

addSchemaLevelResolver(schema, rootResolveFunction)

const app = express()
const server = new ApolloServer({
  schema,
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
