const express = require('express')
const router = express.Router()
const axios = require('axios')
const { User } = require('../models/user')
const { Session } = require('../models/session')
const auth = require('../middleware/auth')

router.get('/login', async (req, res) => {
    let data = await axios.post('https://nextcloud.b-sz-ggyl.logoip.de/index.php/login/v2')
        .catch(e => {
            console.log(e)
        })
    res.status(200).send(data.data)
})

router.get('/me', auth, async (req, res) => {
    console.log(req.user)
    res.status(200).send(req.user)
})

async function generateSession(user) {
    let session = new Session({
        user: user._id,
        token: makeid(64)
    })
    session = await session.save()
    return session.token
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

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
        console.log(user)
        if (!user) {
            const newUser = new User({
                displayName: data.data.loginName
            })
            await newUser.save()
            console.log(newUser)
            res.status(200).send({ token: await generateSession(newUser) })
        } else
            res.status(200).send({ token: await generateSession(user) })
    }, 2000)
})

module.exports = router;