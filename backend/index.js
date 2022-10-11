const express = require('express')
const app = express()
require('dotenv').config()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/dsb', require('./routes/dsb'))

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})