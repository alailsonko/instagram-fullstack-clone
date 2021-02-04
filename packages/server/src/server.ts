import express from 'express'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

const port = `${process.env.PORT}`

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
