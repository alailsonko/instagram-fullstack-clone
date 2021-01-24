import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
const app = express()

dotenv.config()
app.use(routes)
app.listen(process.env.PORT, ()=> {
    console.log(`Listening on port ${process.env.PORT}`)
})
