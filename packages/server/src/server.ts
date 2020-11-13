import express from 'express'
import { Logger } from './utils/logger'
import ConnectionDB from './database'
import initiateEnvVars from './utils/env'

ConnectionDB.then(async () => {
  const app = express()
  initiateEnvVars()
  app.listen(process.env.PORT, () => {
    Logger('info', `Listening on port ${process.env.PORT}`)
  })
}).catch((err: Error) => Logger('error', err.message))
