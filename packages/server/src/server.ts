const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.listen(3333, () => {
    console.log('server running at port 3333');
    
})