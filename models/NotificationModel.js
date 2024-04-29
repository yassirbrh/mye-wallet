const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    notifMessage: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: 'unchecked'
    }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;