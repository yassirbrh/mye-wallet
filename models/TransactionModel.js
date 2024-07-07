const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    senderID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    receiverID : {
        type: mongoose.Types.ObjectId,
        required: true
    },
    transactionBalance: {
        type: Number,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true
    },
    senderMessage: {
        type: String,
        required: true
    },
    doneAt: {
        type: Date,
        required: false
    }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;