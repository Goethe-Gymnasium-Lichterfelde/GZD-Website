const express = require('express')
const router = express.Router()
const axios = require('axios')
const DSB = require('dsbapi')
const dsb = new DSB(process.env.DSB_USN, process.env.DSB_PWD)
const { parse } =  require('node-html-parser')

async function convWebsite(url) {
    const res = await axios.get(url)
        .catch(e => {
            console.log(e)
        })
    const plan = []

    const root = parse(res.data)
    const table = root.querySelector('.mon_list')
    const items = table.querySelectorAll('.list.odd, .list.even')
    for (i = 0; i < items.length; i++) {
        const item = items[i]
        const obj = {}
        obj.klasse = item.childNodes[0].text
        obj.stunde = item.childNodes[1].text
        obj.abwesend = item.childNodes[2].text
        obj.vertreter = item.childNodes[3].text
        obj.fachInKlammern = item.childNodes[4].text
        obj.fach = item.childNodes[5].text
        obj.neuerRaum = item.childNodes[6].text
        obj.art = item.childNodes[7].text
        obj.bemerkung = item.childNodes[8].text

        plan.push(obj)
    }

    return plan
}

router.get('/plan', async (req, res) => {
    dsb.fetch()
        .then(async data => {
            const plans = []
            const timetables = DSB.findMethodInData('timetable', data)
            for (const data of timetables.data) {
                const objs = {
                    name: data.title,
                    date: data.date,
                    plan: []
                }
                for (const plan of data.objects) {
                    const p = await convWebsite(plan.url)
                    for (const item of p) {
                        objs.plan.push(item)
                    }
                }
                plans.push(objs)
            }
            res.send(plans)
        })
        .catch(e => {
            // An error occurred :(
            console.log(e)
            res.status(500).send("Etwas ist schief gelaufen... Sag Mateo bescheid und er wird sich darum kümmern :)")
        })
})

module.exports = router;