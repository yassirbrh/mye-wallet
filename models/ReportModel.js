const mongoose = require('mongoose');

const ReportSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportMessage: {
        type: String,
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    doneAt: {
        type: Date,
        default: Date.now,
    },
    answer: {
        type: String,
        required: false
    },
    state: {
        type: String,
        default: 'unchecked'
    }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
