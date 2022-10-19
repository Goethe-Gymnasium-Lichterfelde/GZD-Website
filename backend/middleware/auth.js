const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
require('dotenv').config()

async function auth(req, res, next) {
    if (!req.header('x-auth-token')) return res.status(401).send('Token wird benötigt.')

    try {
        const token = req.header('x-auth-token')
        const decoded = jwt.verify(token, process.env.JWT_KEY)

        const user = await User.findOne({ _id: decoded._id })

        req.user = user
        next()
    } catch (ex) {
        res.status(400).send('Invalid auth token.')
    }
}

module.exports = auth;