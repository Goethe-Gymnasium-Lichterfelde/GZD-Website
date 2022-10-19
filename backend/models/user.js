const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    emailPassword: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY, { expiresIn: '1h' })
    return token;
}

const User = mongoose.model('User', userSchema)


exports.User = User