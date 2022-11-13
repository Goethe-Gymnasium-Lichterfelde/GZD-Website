const mongoose = require('mongoose')
const Joi = require('joi')

const participatorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
    },
    role: {
        type: String,
        required: false,
        default: 'member'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Participator = mongoose.model('Paricipators', participatorSchema)

function validateParticipator(Participator) {
    const schema = Joi.object({
        user: Joi.string().required(),
        project: Joi.string().required(),
        role: Joi.string().min(3).max(255)
    })

    return schema.validate(Participator)
}

exports.Participator = Participator
exports.validate = validateParticipator