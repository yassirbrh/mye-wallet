import User from '../models/UserModel';
import Notification from '../models/NotificationModel';
import Transaction from '../models/TransactionModel';
const asyncHandler = require('express-async-handler');

const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const limit = parseInt(req.query.limit);

    const notifications = await Notification.find({ userID: userId }).sort({ _id: -1 }).limit(limit);
    const notificationsCount = await Notification.find({ userID: userId, state: 'unchecked' }).countDocuments();
    const uncheckedNotificationsCount = await Notification.find({ userID: userId, $or: [{ state: 'unchecked' }, { state: 'seen' }] }).countDocuments();

    res.status(200).send({notifications, notificationsCount, uncheckedNotificationsCount});
});

const seeNotifications = asyncHandler(async (req, res) => {
    const notificationsIDs = req.body.notificationsIDs;

    try {
        for (const notifID of notificationsIDs) {
            const notification = await Notification.findOne({ notifID });
            notification.state = 'seen';
            await notification.save();
        }
        res.status(200).send({message: 'done'});
    } catch(error) {
        res.status(400).send({ message: error });
    }
    
});

const checkNotification = asyncHandler(async (req, res) => {
    const notifID = req.body.notificationID;

    try {
        const notification = await Notification.findOne({ notifID });
        notification.state = 'checked';
        notification.save();
        if (notification.type === 'Transaction') {
            const transaction = await Transaction.findOne({ _id: notifID });

            res.status(200).send({ type: 'Transaction', transaction });
        }
    } catch(error) {
        res.status(400).send({ message: error });
    }
});

module.exports = { getNotifications, seeNotifications, checkNotification };