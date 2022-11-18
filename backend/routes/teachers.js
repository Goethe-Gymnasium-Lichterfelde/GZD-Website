const express = require('express')
const router = express.Router()
const { Teacher, validate } = require('../models/teacher')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    const teachers = await Teacher.find()
    res.status(200).send(teachers)
})

router.post('/', auth, async (req, res) => {
    if (req.user.role != 'admin') return res.status(403).send('Forbidden')
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const teacher = new Teacher({
        name: req.body.name,
        email: req.body.email,
        abbreviation: req.body.abbreviation
    })
    await teacher.save()
    res.status(200).send(teacher)
})

router.put('/:id', auth, async (req, res) => {
    if (req.user.role != 'admin') return res.status(403).send('Forbidden')
    const teacher = await Teacher.findOne({ _id: req.params.id })
    if (!teacher) return res.status(404).send('Lehrer nicht gefunden')
    teacher.name = req.body.name
    teacher.email = req.body.email
    teacher.abbreviation = req.body.abbreviation
    await teacher.save()
    res.status(200).send(teacher)
})

router.delete('/:id', auth, async (req, res) => {
    if (req.user.role != 'admin') return res.status(403).send('Forbidden')
    const teacher = await Teacher.findOne({ _id: req.params.id })
    if (!teacher) return res.status(404).send('Lehrer nicht gefunden')
    await teacher.delete()
    res.status(200).send(teacher)
})

module.exports = router