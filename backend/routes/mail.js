const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Imap = require('imap')
const inspect = require('util').inspect

router.post('/auth', async (req, res) => {
    var imap = new Imap({
        user: req.body.user,
        password: req.body.password,
        host: 'kopano.b-sz-ggyl.logoip.de',
        port: 993,
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false
        }
    })

    imap.once('ready', function () {
        res.status(200).send('OK')
    })

    imap.once('error', function (err) {
        res.status(500).send(err)
    })

    imap.once('end', function () {
        console.log('Connection ended')
    })

    imap.connect()
})

module.exports = router;