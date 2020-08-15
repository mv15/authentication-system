const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    otp:{
        type: String,
        default:'#####',
    }
}, {
    timestamps: true    // for created at and updated at
});

const User = mongoose.model('User', userSchema);

module.exports = User;