const express = require('express')
const router = express.Router()
const { Organisation, validate } = require('../../models/organisation')
const { Project } = require('../../models/project')
const { User } = require('../../models/user')
const { Member } = require('../../models/member')
const auth = require('../../middleware/auth')

router.get('/', auth, async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10
    const page = req.query.page ? parseInt(req.query.page) : 1

    const organisation = await Organisation.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .select('-__v')
    res.send(organisation)
})

router.get('/:id', auth, async (req, res) => {
    const Organisation = await Organisation.findById(req.params.id)
        .select('-__v')
    if (!Organisation) return res.status(404).send('Die Organisation wurde nicht gefunden.')
    res.send(Organisation)
})

router.get('/:id/membercount', auth, async (req, res) => {
    const org = await Organisation.findById(req.params.id)
        .select('-__v')
    if (!org) return res.status(404).send('Die Organisation wurde nicht gefunden.')
    const membercount = await Member.countDocuments({ organisation: org._id })
    res.send({ membercount: membercount })
})

router.get('/:id/projects', auth, async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10
    const page = req.query.page ? parseInt(req.query.page) : 1

    const projects = await Project.find({ organisation: req.params.id })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .select('-__v')
    res.send(projects)
})

router.post('/', auth, async (req, res) => {
    const org = {
        name: req.body.name,
        description: req.body.description,
        banner: "   "
    }
    const { error } = validate(org)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findById(req.body.owner)
    if (!user) return res.status(400).send('Der Benutzer wurde nicht gefunden.')

    const organisation = new Organisation({
        name: org.name,
        description: org.description,
        banner: org.banner
    })
    await organisation.save()

    const member = new Member({
        user: user._id,
        organisation: organisation._id,
        role: "owner"
    })
    await member.save()

    res.send(organisation)
})

router.post('/:id/join', auth, async (req, res) => {
    const organisation = await Organisation.findById(req.params.id)
    if (!organisation) return res.status(404).send('Die Organisation wurde nicht gefunden.')

    const member = new Member({
        user: req.user._id,
        organisation: req.params.id
    })
    await member.save()

    res.send(member)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const organisation = await Organisation.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        banner: req.body.banner
    }, { new: true })
    if (!organisation) return res.status(404).send('Die Organisation wurde nicht gefunden.')

    res.send(organisation)
})

router.delete('/:id', auth, async (req, res) => {
    const organisation = await Organisation.findByIdAndRemove(req.params.id)
    if (!organisation) return res.status(404).send('Die Organisation wurde nicht gefunden.')

    res.send(organisation)
})

module.exports = router