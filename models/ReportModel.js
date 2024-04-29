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
    answer: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: 'unchecked'
    }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
