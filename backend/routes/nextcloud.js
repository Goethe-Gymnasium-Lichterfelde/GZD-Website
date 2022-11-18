const express = require('express')
const router = express.Router()
const axios = require('axios')
const { User } = require('../models/user')
const auth = require('../middleware/auth')

router.get('/login', async (req, res) => {
    let data = await axios.post('https://nextcloud.b-sz-ggyl.logoip.de/index.php/login/v2')
        .catch(e => {})
    res.status(200).send(data.data)
})

router.get('/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.put('/me', auth, async (req, res) => {

    let user = await User.findOne({ _id: req.user._id })
    if (!user) return res.status(400).send('User not found')

    const puser = await User.findByIdAndUpdate(req.user._id, {
        emailPassword: req.body.emailPassword,
        settings: req.body.settings
    }, { new: true })
    res.status(200).send(puser)
})

router.get('/login/:token', async (req, res) => {
    // Run funtion every 2 seconds for the next 5 minutes
    let started = Date.now()
    let interval = setInterval(async () => {
        const data = await axios.post('https://nextcloud.b-sz-ggyl.logoip.de/index.php/login/v2/poll?token=' + req.params.token)
            .catch(err => { })
        if (!data) return
        if (data.status != 200) {
            if (Date.now() - started > 300000) {
                clearInterval(interval)
                res.status(500).send('Timeout')
            } else
                return
        }

        clearInterval(interval)
        const user = await User.findOne({ displayName: data.data.loginName })
        if (!user) {
            const newUser = new User({
                displayName: data.data.loginName,
                settings: {
                    lehrer: []
                }
            })
            await newUser.save()
            res.status(200).send({ token: newUser.generateAuthToken() })
        } else
            res.status(200).send({ token: user.generateAuthToken() })
    }, 2000)
})

module.exports = router