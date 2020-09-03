import 'reflect-metadata'
import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express'
import routes from './routes'
import AppError from './errors/AppError'
import cors from 'cors'
import { createConnection } from 'typeorm'

createConnection({
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "docker",
  "database": "postgres",
  "synchronize": true,
  "logging": false,
  "entities": [
     "src/database/entities/*.ts"
  ],
  "migrations": [
     "src/database/migrations/*.ts"
  ],
  "subscribers": [
     "src/database/subscribers/*.ts"
  ],
})
  .then(async connection => {
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use(routes)
    app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          status: 'error',
          message: err.message
        })
      }
      console.log(err)
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      })
    })
    app.listen(3333, () => {
      console.log('server running at port 3333')
    })
  })
  .catch(error => console.log(error))
