const mongoose = require('mongoose')
const Joi = require('joi')

const organisationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const Organisation = mongoose.model('Organisation', organisationSchema)

function validateOrganisation(organisation) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(3).max(255),
        owner: Joi.string().required(),
        banner: Joi.string().min(3).max(255)
    })

    return schema.validate(organisation)
}

exports.Organisation = Organisation
exports.validate = validateOrganisation