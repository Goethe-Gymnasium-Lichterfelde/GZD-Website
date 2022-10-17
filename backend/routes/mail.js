const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Imap = require('imap')
const inspect = require('util').inspect
const server = require('http').createServer()
const io = require('socket.io')(server)

io.on('connection', client => {
    let imap = null

    client.on('disconnect', () => {})
    client.on('connect', data => {
        imap = new Imap({
            user: data.user,
            password: data.password,
            host: 'kopano.b-sz-ggyl.logoip.de',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false
            }
        })

        imap.once('ready', function () {
            client.send('ready', true)
        })
    
        imap.once('error', function (err) {
            client.send('error', { message: err })
        })
    })

    client.on('')
})

server.listen(3050)

module.exports = router