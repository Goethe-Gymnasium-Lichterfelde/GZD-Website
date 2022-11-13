const mongoose = require('mongoose')
const Joi = require('joi')

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
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

const Member = mongoose.model('Members', memberSchema)

function validateMember(member) {
    const schema = Joi.object({
        user: Joi.string().required(),
        organisation: Joi.string().required(),
        role: Joi.string().min(3).max(255)
    })

    return schema.validate(member)
}

exports.Member = Member
exports.validate = validateMember