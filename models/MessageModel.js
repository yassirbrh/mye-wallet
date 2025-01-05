const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    senderID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    receiverID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    doneAt: {
        type: Date,
        default: Date.now,
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;