const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    userType: {
        type: String,
        enum: ['user', 'author'],
        required: true,
        default: 'user'
    }
}, { versionKey: false })

const User = mongoose.model('User', userSchema);

module.exports = User;