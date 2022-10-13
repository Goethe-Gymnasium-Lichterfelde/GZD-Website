const { Session } = require('../models/session')
const { User } = require('../models/user')
require('dotenv').config()

async function auth(req, res, next) {
    if (!req.header('x-auth-token')) return res.status(401).send('Token wird benötigt')

    try {
        const token = req.header('x-auth-token')

        const session = await Session.findOne({ token: token })
        if (!session) return res.status(400).send('Token ist ungültig')

        req.user = await User.findById(session.user)
        next()
    } catch (ex) {
        res.status(400).send('Token ist ungültig')
    }
}

module.exports = auth;