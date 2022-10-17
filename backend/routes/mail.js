const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Imap = require('imap')
const inspect = require('util').inspect
const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})
const { Session } = require('../models/session')
const  { User } = require('../models/user')



io.on('connection', client => {
    let imap = null

    client.on('setPassword', async (data) => {
        const session = await Session.findOne({ token: data.token })
        if (!session) return client.emit('error', 'Die Sitzung ist abgelaufen.')
        const user = await User.findById(session.user)
        if (!user) return client.emit('error', 'Der Benutzer wurde nicht gefunden.')
        const password = Buffer.from(data.password).toString('base64')
    
        user.emailPassword = password
        await user.save()
        client.emit('passwordSet')
    })

    client.on('disconnect', () => {})
    client.on('auth', async (token) => {
        const session = await Session.findOne({ token: token })
        if (!session) return client.emit('error', 'Die Sitzung ist ungültig.')
        const user = await User.findById(session.user)
        if (!user) return client.emit('error', 'Der Benutzer wurde nicht gefunden.')
        let emailPassword = user.emailPassword

        if (emailPassword) {
            // Decode password
            emailPassword = Buffer.from(emailPassword, 'base64').toString('ascii')
        } else {
            return client.emit('error', 500)
        }

        imap = new Imap({
            user: user.displayName,
            password: emailPassword,
            host: 'kopano.b-sz-ggyl.logoip.de',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false
            }
        })

        imap.once('ready', function () {
            imap.getBoxes(function (err, boxes) {
                if (err) return client.emit('error', err)
                client.emit('folders', boxes)
                imap.openBox('INBOX', true, function (err, box) {
                    if (err) return client.emit('error', err)
                    imap.search(['ALL'], function (err, results) {
                        if (err) return client.emit('error', err)
                        let f = imap.fetch(results, {
                            bodies: '',
                            markSeen: true
                        })
                        f.on('message', function (msg, seqno) {
                            msg.on('body', function (stream, info) {
                                let buffer = ''
                                stream.on('data', function (chunk) {
                                    buffer += chunk.toString('utf8')
                                })
                                stream.once('end', function () {
                                    client.emit('message', buffer)
                                })
                            })
                        })
                        f.once('error', function (err) {
                            client.emit('error', err)
                        })
                        f.once('end', function () {
                            client.emit('end')
                        })
                    })
                })
            })
        })
    
        imap.once('error', function (err) {
            client.send('error', 500)
        })
    })
})

server.listen(3050)

module.exports = router