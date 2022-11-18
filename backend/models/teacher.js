const mongoose = require('mongoose')
const Joi = require('joi')

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 255
    },
    abbreviation: {
        type: String,
        required: true,
        minlength: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Teacher = mongoose.model('Teachers', teacherSchema)

function validateTeacher(teacher) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(3).max(255),
        abbreviation: Joi.string().min(1).max(255).required()
    })

    return schema.validate(teacher)
}

exports.Teacher = Teacher
exports.validate = validateTeacher