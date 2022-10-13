const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/login', async (req, res) => {
    let data = await axios.post('https://nextcloud.b-sz-ggyl.logoip.de/index.php/login/v2')
        .catch(e => {
            console.log(e)
        })
    res.status(200).send(data.data)
})

router.get('/login/:token', async (req, res) => {
    // Run funtion every 2 seconds for the next 5 minutes
    let started = Date.now()
    let interval = setInterval(async () => {
        const data = await axios.post('https://nextcloud.b-sz-ggyl.logoip.de/index.php/login/v2/poll?token=' + req.params.token)
            .catch(err => {})
        if (data) {
            clearInterval(interval)
            res.status(200).send(data.data)
        }
        // Stop after 5 minutes
        if (Date.now() - started > 300000) {
            clearInterval(interval)
            res.status(500).send('Timeout')
        }
    }, 2000)
})

module.exports = router;