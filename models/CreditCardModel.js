const mongoose = require('mongoose');

const CreditCardSchema = mongoose.Schema({
    cardNumber: {
        type: Number,
        required: true
    },
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    holderName: {
        type: String,
        required: true
    },
    expDate: {
        type: Date,
        required: true
    },
    CVV: {
        type: String,
        required: true
    },
    cardType: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: 'pending'
    }
});

const CreditCard = mongoose.model('CreditCard', CreditCardSchema);

module.exports = CreditCard;