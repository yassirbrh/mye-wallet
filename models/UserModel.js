const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9_-]{3,16}$/, "Invalid username !!"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address !!"]
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    photo: {
        type: Buffer,
        required: false
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
