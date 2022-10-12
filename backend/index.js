const express = require('express')
const app = express()
require('dotenv').config()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
    next();
})

app.use('/dsb', require('./routes/dsb'))
app.use('/nextcloud', require('./routes/nextcloud'))

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})