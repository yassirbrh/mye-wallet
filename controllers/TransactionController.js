import User from '../models/UserModel';
import Notification from '../models/NotificationModel';
import Transaction from '../models/TransactionModel';
const asyncHandler = require('express-async-handler');

const transferMoney = asyncHandler(async (req, res) => {
    const senderID = req.session.userId;
    const receiverUsername = req.body.receiverUsername;
    const transactionBalance = req.body.balance;
    const senderMessage = req.body.message;

    const sender = await User.findById(senderID);
    const receiver = await User.findOne({ userName: receiverUsername });
    if (sender && receiver) {
        if (sender.balance >= transactionBalance) {
            const transaction = new Transaction({
                senderID,
                receiverID: receiver._id,
                transactionBalance,
                isDone: true,
                senderMessage,
                doneAt: new Date()
            });
            const savedTransaction = await transaction.save();
            const notification = new Notification({
                userID: receiver._id,
                notifMessage: `You've received a payment of ${transactionBalance} from ${sender.userName}`,
                type: 'Transaction',
                notifID: savedTransaction._id
            });
            await notification.save();
            sender.balance = parseFloat((sender.balance - transactionBalance).toFixed(2));
            receiver.balance = parseFloat(receiver.balance) + parseFloat(transactionBalance);
            await sender.save();
            await receiver.save();
        } else {
            const transaction = new Transaction({
                senderID,
                receiverID: receiver._id,
                transactionBalance,
                isDone: false,
                senderMessage
            });
            const savedTransaction = await transaction.save();
            const notification = new Notification({
                userID: sender._id,
                notifMessage: `Oops! Your transaction to ${receiver.userName} couldn't be processed. Please try again later.`,
                type: 'Transaction',
                notifID: savedTransaction._id
            });
            await notification.save();
        }
    } else {
        res.status(401).send('Something went wrong !!');
    }
});

const getTransactions = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const transactions = await Transaction.find({
        $or: [
            { senderID: userId },
            { receiverID: userId }
        ]
    });

    res.status(200).send(transactions);
});

module.exports = { transferMoney, getTransactions };
