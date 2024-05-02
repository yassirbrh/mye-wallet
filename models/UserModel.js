const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
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
        required: false
    },
    photo: {
        type: Buffer,
        required: false
    },
    isAccepted: {
        type: Boolean,
        default: false
    } 
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPwd = await bcryptjs.hash(this.password, salt);
    this.password = hashPwd;
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
