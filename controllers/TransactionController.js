import User from '../models/UserModel';
import Notification from '../models/NotificationModel';
import Transaction from '../models/TransactionModel';
import redisClient from '../cache/redisClient';
const asyncHandler = require('express-async-handler');

const transferMoney = asyncHandler(async (req, res) => {
    const senderID = req.session.userId;
    const receiverUsername = req.body.receiverUsername;
    const transactionBalance = req.body.balance;
    const senderMessage = req.body.message;

    const sender = await User.findById(senderID);
    const receiver = await User.findOne({ userName: receiverUsername });

    if (sender && receiver) {
        const isBalanceSufficient = sender.balance >= transactionBalance;

        // Create transaction object
        const transaction = new Transaction({
            senderID,
            receiverID: receiver._id,
            transactionBalance,
            isDone: isBalanceSufficient,
            senderMessage,
            doneAt: new Date(),
        });
        const savedTransaction = await transaction.save();

        // Format the date to "12 Dec 2024"
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date());

        const transactionData = {
            ...savedTransaction.toObject(),
            operatorUsername: receiver.userName, // Add operatorUsername (receiver for sender's cache)
            status: 'sent', // Mark as "sent" for sender's cache
            doneAt: formattedDate, // Add formatted date
        };

        const senderCacheKey = `transactions:${senderID}`;
        const receiverCacheKey = `transactions:${receiver._id}`;

        try {
            // Update sender's cache
            await updateTransactionCache(senderCacheKey, {
                ...transactionData,
                operatorUsername: receiver.userName,
                status: 'sent',
            });

            // Update receiver's cache
            await updateTransactionCache(receiverCacheKey, {
                ...transactionData,
                operatorUsername: sender.userName,
                status: 'received',
            });
        } catch (err) {
            console.error('Redis operation failed:', err);
        }

        if (isBalanceSufficient) {
            const notification = new Notification({
                userID: receiver._id,
                notifMessage: `You've received a payment of ${transactionBalance} from ${sender.userName}`,
                type: 'Transaction',
                notifID: savedTransaction._id,
            });
            await notification.save();

            sender.balance = parseFloat((sender.balance - transactionBalance).toFixed(2));
            receiver.balance = parseFloat(receiver.balance) + parseFloat(transactionBalance);
            await sender.save();
            await receiver.save();

            res.status(200).send({ message: 'Transaction Successful !!' });
        } else {
            const notification = new Notification({
                userID: sender._id,
                notifMessage: `Oops! Your transaction to ${receiver.userName} couldn't be processed. Please try again later.`,
                type: 'Transaction',
                notifID: savedTransaction._id,
            });
            await notification.save();

            res.status(400).send({ message: 'Insufficient balance for transaction.' });
        }
    } else {
        res.status(400).send({ message: 'Invalid receiver username !!' });
    }
});

/**
 * Helper function to update Redis cache for transactions
 * @param {string} cacheKey - Redis cache key
 * @param {Object} transaction - Transaction data to add
 */
async function updateTransactionCache(cacheKey, transaction) {
    const keyExists = await redisClient.exists(cacheKey);
    if (keyExists) {
        const cacheData = await redisClient.get(cacheKey);
        const transactionsArray = cacheData ? JSON.parse(cacheData) : [];
        transactionsArray.unshift(transaction); // Add new transaction at the beginning
        await redisClient.set(cacheKey, JSON.stringify(transactionsArray));
    } else {
        await redisClient.set(cacheKey, JSON.stringify([transaction])); // Create a new array
    }
}


const getCachedTransactions = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const cacheKey = `transactions:${userId}`;

    const transactions = await redisClient.get(cacheKey);

    res.status(200).send(transactions);
})



const cacheLoadTransactions = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(400).send({ message: 'User not authenticated' });
    }

    const cacheKey = `transactions:${userId}`;

    try {
        // Check if data exists in Redis cache
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            // If data exists, parse and send it
            const transactions = JSON.parse(cachedData);
            return res.status(200).send(transactions);
        }

        // Fetch transactions from the database
        const transactions = await Transaction.find({
            $or: [
                { senderID: userId },
                { receiverID: userId, isDone: true }
            ]
        }).sort({ doneAt: -1 });

        // Map over the transactions to add formatted date and operatorUsername
        const updatedTransactions = await Promise.all(
            transactions.map(async (transaction) => {
                // Format the doneAt date
                const formattedTransaction = {
                    ...transaction.toObject(),
                    doneAt: transaction.doneAt.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    }),
                };

                // Determine operatorUsername
                if (transaction.senderID.toString() === userId) {
                    // If the sender is not the user, fetch sender's username
                    const operator = await User.findById(transaction.receiverID);
                    formattedTransaction.operatorUsername = operator ? operator.userName : 'Unknown';
                    formattedTransaction.status = 'received';
                } else if (transaction.receiverID.toString() === userId) {
                    // If the receiver is not the user, fetch receiver's username
                    const operator = await User.findById(transaction.senderID);
                    formattedTransaction.operatorUsername = operator ? operator.userName : 'Unknown';
                    formattedTransaction.status = 'sent';
                }
                

                return formattedTransaction;
            })
        );

        // Store the updated transactions in Redis cache
        await redisClient.set(cacheKey, JSON.stringify(updatedTransactions), {
            EX: 3600, // Cache expiration time in seconds (1 hour)
        });

        // Send the transactions as response
        res.status(200).send(updatedTransactions);
    } catch (error) {
        console.error('Error caching transactions:', error);
        res.status(500).send({ message: 'Error loading transactions' });
    }
});


const getTransactions = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const limit = parseInt(req.query.limit); // Parse the query parameter as an integer

    const transactions = await Transaction.find({
        $or: [
            { senderID: userId },
            { receiverID: userId, isDone: true }
        ]
    })
    .sort({ doneAt: -1 })
    .limit(limit); // Apply the limit if provided

    res.status(200).send(transactions);
});

module.exports = { transferMoney, getTransactions, cacheLoadTransactions, getCachedTransactions };
