const mongoose = require('mongoose')
const Joi = require('joi')

const projectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Project = mongoose.model('Projects', projectSchema)

function validateProject(project) {
    const schema = {
        owner: Joi.string().required(),
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(3).max(255),
        banner: Joi.string().min(3).max(255)
    }

    return Joi.validate(project, schema)
}

exports.Project = Project
exports.validate = validateProject