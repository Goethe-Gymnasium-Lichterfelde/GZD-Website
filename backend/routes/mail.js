const express = require('express')
const router = express.Router()
const Imap = require('imap')
const inspect = require('util').inspect
const server = require('http').createServer()
const { User } = require('../models/user')
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

io.on('connection', (client) => {

    let imap = null

    client.on('config', async (data) => {
        
        const decoded = jwt.verify(data.token, process.env.JWT_KEY)
        const user = await User.findOne({ _id: decoded._id })

        console.log(user)
        try {
            const coded = user.emailPassword
            const decoded = jwt.verify(coded, process.env.JWT_KEY)

            imap = new Imap({
                user: user.displayName,
                password: decoded,
                host: 'kopano.b-sz-ggyl.logoip.de',
                port: 993,
                tls: true,
                tlsOptions: {
                    rejectUnauthorized: false
                }
            })

            imap.once('ready', async function () {
                console.log('ready')

                // Send the folder structure to the client
                imap.getBoxes(function (err, boxes) {
                    client.emit('folders', boxes)
                })
            })

            imap.once('error', function (err) {
                console.log(err)
            })

            imap.once('end', function () {
                console.log('Connection ended')
            })

            imap.connect()
        } catch (ex) {
            client.emit('falschPW')
        }
    })

    client.on('getMails', (data) => {
        const folder = data.folder
        const page = data.page
        const limit = data.perPage

        console.log(page, limit)

        imap.openBox(folder, true, function (err, box) {
            if (err) throw err
            let max = box.messages.total
            if (((page * limit) + limit) <= box.messages.total)
                max = (page * limit) + limit

            const f = imap.seq.fetch(page * limit + ':' + max, {
                bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
                struct: true
            })

            f.on('message', function (msg, seqno) {
                const prefix = '(#' + seqno + ') '
                msg.on('body', function (stream, info) {
                    let buffer = ''
                    stream.on('data', function (chunk) {
                        buffer += chunk.toString('utf8')
                    })
                    stream.once('end', function () {
                        client.emit('mails', buffer)
                    })
                })
            })
        })

    })
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