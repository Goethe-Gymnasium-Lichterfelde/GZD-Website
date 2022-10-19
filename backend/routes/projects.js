const express = require('express')
const router = express.Router()
const { Project, validate } = require('../models/project')
const { User } = require('../models/user')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10
    const page = req.query.page ? parseInt(req.query.page) : 1

    const projects = await Project.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .select('-__v')
    res.send(projects)
})

router.get('/:id', auth, async (req, res) => {
    const project = await Project.findById(req.params.id)
        .select('-__v')
    if (!project) return res.status(404).send('Das Projekt wurde nicht gefunden.')
    res.send(project)
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findById(req.body.owner)
    if (!user) return res.status(400).send('Der Benutzer wurde nicht gefunden.')

    const project = new Project({
        owner: req.body.owner,
        name: req.body.name,
        description: req.body.description,
        banner: req.body.banner
    })
    await project.save()

    res.send(project)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const project = await Project.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        banner: req.body.banner
    }, { new: true })
    if (!project) return res.status(404).send('Das Projekt wurde nicht gefunden.')

    res.send(project)
})

router.delete('/:id', auth, async (req, res) => {
    const project = await Project.findByIdAndRemove(req.params.id)
    if (!project) return res.status(404).send('Das Projekt wurde nicht gefunden.')

    res.send(project)
})

module.exports = router