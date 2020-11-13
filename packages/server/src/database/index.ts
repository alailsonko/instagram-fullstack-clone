import { createConnections, Connection } from 'typeorm'
import { Logger } from '../utils/logger'
import initiateEnvVars from '../utils/env'

initiateEnvVars()

export default createConnections([
  {
    name: 'default',
    type: 'postgres',
    port: process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ['src/database/entities/*.ts'],
    migrations: ['src/database/migrations/*.ts'],
    subscribers: ['src/database/subscribers/*.ts'],
    cli: {
      entitiesDir: 'src/database/entities',
      migrationsDir: 'src/database/migrations',
      subscribersDir: 'src/database/subscribers'
    }
  }
])
  .then((data: Connection[]) => {
    data.map(item => {
      Logger('info', `Connection status ${item.isConnected}`)
      Logger('info', `Connection type ${item.options.type}`)
      Logger('info', `Connection name ${item.name}`)
    })
  })
  .catch((err: Error) => Logger('error', err.message))
