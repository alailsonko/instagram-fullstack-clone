import { createConnection } from 'typeorm'

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'tracking-system',
  entities: ['/entities/*.js'],
  synchronize: true
})
  .then(connection => {
    // here you can start to work with your entities
  })
  .catch(error => console.log(error))
