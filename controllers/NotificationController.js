import AmountDemand from '../models/AmountDemandModel';
import Message from '../models/MessageModel';
import Notification from '../models/NotificationModel';
import Transaction from '../models/TransactionModel';
import Report from '../models/ReportModel';
import CreditCard from '../models/CreditCardModel';
import Assistance from '../models/AssistanceModel';
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
    const type = req.body.type;

    try {
        if (type === 'Assistance') {
            await Notification.updateMany(
                { type: 'Assistance', notifID }, // update all with this notifID
                { $set: { state: 'checked' } }
            );
        }
        const notification = await Notification.findOne({ notifID });
        if (notification) {
            notification.state = 'checked';
            await notification.save();
        } 
        if (notification.type === 'Transaction') {
            const transaction = await Transaction.findOne({ _id: notifID });

            res.status(200).send({ type: 'Transaction', transaction });
        } else if (notification.type === 'Message') {
            const message = await Message.findById(notifID);

            res.status(200).send({ type: 'Message', message});
        } else if (notification.type === 'Amount Demand') {
            const amountdemand = await AmountDemand.findById(notifID);

            res.status(200).send({ type: 'Amount Demand', amountdemand})
        } else if (notification.type === 'Report') {
            const report = await Report.findById(notifID);

            res.status(200).send({ type: 'Report', report });
        } else if (notification.type ==='Credit Card') {
            const creditcard = await CreditCard.findById(notifID);

            res.status(200).send({ type: 'Credit Card', creditcard });
        } else if (notification.type === 'Assistance') {
            const assistance = await Assistance.findById(notifID);

            res.status(200).send({ type: 'Assistance', assistance })
        }
    } catch(error) {
        res.status(400).send({ message: error });
    }
});

module.exports = { getNotifications, seeNotifications, checkNotification };