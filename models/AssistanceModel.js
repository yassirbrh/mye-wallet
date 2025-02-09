const mongoose = require('mongoose');

const AssistanceSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    messages: [{
        senderID: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        sentAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Assistance = mongoose.model('Assistance', AssistanceSchema);

module.exports = Assistance;