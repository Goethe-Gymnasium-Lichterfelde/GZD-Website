const express = require('express')
const router = express.Router()
const Imap = require('imap')
const inspect = require('util').inspect
const server = require('http').createServer()
const { User } = require('../models/user')
const simpleParser = require('mailparser').simpleParser
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// imap = new Imap({
//     user: user.displayName,
//     password: emailPassword,
//     host: 'kopano.b-sz-ggyl.logoip.de',
//     port: 993,
//     tls: true,
//     tlsOptions: {
//         rejectUnauthorized: false
//     }
// })

io.on('connection', async (client) => {

    const token = client.handshake.query.token
    let decoded = jwt.verify(token, process.env.JWT_KEY)
    let user = await User.findOne({ _id: decoded._id })
    if (!user) return client.disconnect()
    let folder = 'INBOX'

    // Check if emailPassword is set
    if (!user.emailPassword) {
        client.emit('error', "0x01")
        client.disconnect()
        return
    }

    const emailPassword = jwt.verify(user.emailPassword, process.env.JWT_KEY)

    let imap = new Imap({
        user: user.displayName,
        password: emailPassword,
        host: 'kopano.b-sz-ggyl.logoip.de',
        port: 993,
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false
        }
    })

    function openInbox(page, limit) {
        imap.openBox(folder, true, function (err, box) {
            if (err) throw err
            if (box.messages.total == 0) {
                client.emit('error', "0x03")
                return
            }

            let min = null
            if ((box.messages.total - ((page + 1) * limit)) + 1 <= 0)
                min = 1
            imap.search(['UNSEEN'], function (err, results) {
                if (err) throw err
                if (results.length > 0) {
                    client.emit('unread', results.length)
                }
            })
            if ((box.messages.total - (page * limit) - 1) <= 0) {
                client.emit('error', "0x05")
                return
            }
            // console.log((min != null ? min : (box.messages.total - ((page + 1) * limit))) + ':' + (box.messages.total - (page * limit) - 1))
            const f = imap.seq.fetch((min!=null?min:(box.messages.total - ((page + 1) * limit)) + 1) + ':' + (box.messages.total - (page * limit)), {
                bodies: ""
            })

            f.on('message', function (msg, seqno) {

                msg.on('body', function (stream, info) {
                    let buffer = ''
                    let flags = null
                    let uid = null
                    stream.on('data', function (chunk) {
                        buffer += chunk.toString('utf8')
                    })
                    msg.once('attributes', function (attrs) {
                        flags = attrs.flags
                        uid = attrs.uid
                    })
                    stream.once('end', async function () {
                        let mail = await simpleParser(buffer)
                        mail.flags = flags
                        mail.uid = uid
                        mail.folder = folder
                        client.emit('email', mail)
                    })
                })
            })
            f.once('error', function (err) {
                console.log('Fetch error: ' + err)
            })
            f.once('end', function () {
                client.emit('end')
            })
        })
    }

    imap.once('ready', function () {
        openInbox(0, 20)

        imap.openBox('INBOX', true, function (err, box) {
            if (err) throw err
            imap.search(['UNSEEN'], function (err, results) {
                if (err) throw err
                if (results.length > 0) {
                    client.emit('unread', results.length)
                }
            })
        })
    })

    imap.once('error', function (err) {
        if (err.source == 'authentication')
            client.emit('error', "0x01")
        else
            client.emit('error', "0x02")
    })

    imap.once('end', function () {
        console.log('Connection ended')
    })

    client.on('folder', (data) => {
        folder = data.folder || 'INBOX'
        const page = data.page || 0
        const limit = data.limit || 20
        if (imap.state !== 'authenticated')
            imap.connect()
        else
            openInbox(page, limit)
    })

    imap.connect()
})

router.post('/setpw', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    const pw = req.body.password
    const coded = jwt.sign(pw, process.env.JWT_KEY)
    user.emailPassword = coded
    await user.save()
    res.status(200).send('Passwort gespeichert')
})


server.listen(3050)

module.exports = router