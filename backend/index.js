const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()

// Connect to MongoDB
// MONGO_URI example: mongodb://0.0.0.0/gzd
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB')
}).catch(err => {
    console.log(err)
})

app.use(express.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token, authorization")
    next();
})

app.use('/dsb', require('./routes/dsb'))
app.use('/nextcloud', require('./routes/nextcloud'))
app.use('/mail', require('./routes/mail'))
app.use('/teachers', require('./routes/teachers'))

app.use('/projects', require('./routes/projects/projects'))
app.use('/organisations', require('./routes/projects/organisations'))

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})