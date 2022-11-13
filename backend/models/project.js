const mongoose = require('mongoose')
const Joi = require('joi')

const projectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    banner: {
        type: String,
        required: false
    },
    tags: {
        type: Array,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Project = mongoose.model('Projects', projectSchema)

function validateProject(project) {
    const schema = Joi.object({
        owner: Joi.string().required(),
        name: Joi.string().min(3).max(255).required(),
        organisation: Joi.string().required(),
        description: Joi.string().min(3).max(255),
        banner: Joi.string().min(3).max(255),
        tags: Joi.array().items(Joi.string())
    })

    return schema.validate(project)
}

exports.Project = Project
exports.validate = validateProject