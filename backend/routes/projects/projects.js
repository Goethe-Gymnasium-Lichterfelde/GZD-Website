const express = require('express')
const router = express.Router()
const { Project, validate } = require('../../models/project')
const { User } = require('../../models/user')
const { Participator } = require('../../models/participator')
const auth = require('../../middleware/auth')

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

    const organisation = await Organisation.findById(req.body.organisation)
    if (!organisation) return res.status(400).send('Die Organisation wurde nicht gefunden.')

    const project = new Project({
        owner: req.body.owner,
        organisation: req.body.organisation,
        name: req.body.name,
        description: req.body.description,
        banner: req.body.banner,
        tags: req.body.tags
    })
    await project.save()

    res.send(project)
})

router.post('/:id/join', auth, async (req, res) => {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).send('Das Projekt wurde nicht gefunden.')

    const user = await User.findById(req.body.user)
    if (!user) return res.status(404).send('Der Benutzer wurde nicht gefunden.')

    const participator = new Participator({
        user: req.body.user,
        project: req.params.id
    })
    await participator.save()

    res.send(participator)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if the user is the owner of the project
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).send('Das Projekt wurde nicht gefunden.')
    if (project.owner != req.user._id) return res.status(403).send('Sie sind nicht berechtigt, dieses Projekt zu bearbeiten.')

    const updated_project = await Project.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        banner: req.body.banner,
        tags: req.body.tags
    }, { new: true })
    if (!updated_project) return res.status(404).send('Das Projekt wurde nicht gefunden.')

    res.send(updated_project)
})

router.delete('/:id', auth, async (req, res) => {

    // Check if the user is the owner of the project
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).send('Das Projekt wurde nicht gefunden.')
    if (project.owner != req.user._id) return res.status(403).send('Sie sind nicht berechtigt, dieses Projekt zu löschen.')

    const deleted_project = await Project.findByIdAndRemove(req.params.id)
    if (!deleted_project) return res.status(404).send('Das Projekt wurde nicht gefunden.')

    res.send(deleted_project)
})

module.exports = router