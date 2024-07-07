const mongoose = require('mongoose');

const AmountDemandSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    doneAt: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        required: false,
        enum: ['accepted', 'denied']
    }
});

const AmountDemand = mongoose.model('AmountDemand', AmountDemandSchema);

module.exports = AmountDemand;