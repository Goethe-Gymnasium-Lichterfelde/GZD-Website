const express = require('express')
const router = express.Router()

router.get('/login', async (req, res) => {
    let data = await fetch('https://nextcloud.b-sz-ggyl.logoip.de/index.php/login/v2', { method: 'POST' })
    data = await data.json()
    res.status(200).send(data)
})

router.get('/login/:token', async (req, res) => {
    // Run funtion every 2 seconds for the next 5 minutes
    let interval = setInterval(async () => {
        const data = await fetch('https://nextcloud.b-sz-ggyl.logoip.de/index.php/login/v2/poll?token=' + req.params.token, {
            method: 'POST'
        }).catch(err => {
            console.log(err)
        })
        if (data.status == 200) {
            clearInterval(interval)
            res.status(200).send(await data.json())
        }
    }, 2000)
})

module.exports = router;