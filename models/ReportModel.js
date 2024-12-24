const mongoose = require('mongoose');

const ReportSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
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
        required: true
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
