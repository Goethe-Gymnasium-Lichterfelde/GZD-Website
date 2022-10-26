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

    imap.once('ready', function () {
        function openInbox(folder, page, limit) {
            imap.openBox(folder, true, function (err, box) {
                if (err) throw err
                console.log('Total messages: ' + box.messages.total)
                console.log((box.messages.total - ((page + 1) * limit)) + ':' + (box.messages.total - (page * limit)))

                const f = imap.seq.fetch((box.messages.total - ((page + 1) * limit)) + ':' + (box.messages.total - (page * limit)), {
                    bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
                    struct: true
                })

                f.on('message', function (msg, seqno) {
                    msg.on('body', function (stream, info) {
                        let buffer = ''
                        stream.on('data', function (chunk) {
                            buffer += chunk.toString('utf8')
                        })
                        stream.once('end', async function () {
                            client.emit('email', await simpleParser(buffer))
                        })
                    })
                })
                f.once('error', function (err) {
                    console.log('Fetch error: ' + err)
                })
            })
        } 

        openInbox('INBOX', 0, 20)
    })

    imap.once('error', function (err) {
        console.log(err)
        client.emit('error', "0x02")
        client.disconnect()
    })

    imap.once('end', function () {
        console.log('Connection ended')
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