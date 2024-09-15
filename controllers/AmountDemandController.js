import User from '../models/UserModel';
import AmountDemand from '../models/AmountDemandModel';
const asyncHandler = require('express-async-handler');

const requestBalance = asyncHandler(async (req, res) => {
    const userID = req.session.userId;
    const amount = Number(req.body.amount);

    const user = await User.findById(userID);

    // Ensure amount is a valid number
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Amount should be a valid positive number !!" });
    }

    if (user) {
        const doneAt = new Date();
        const newDemand = new AmountDemand({
            userID, amount, doneAt
        });
        await newDemand.save();
        res.status(200).json({ message: "Demand successfully registered !! pending !!" });
    } else {
        res.status(401).json({ message: "User Not Found !!" });
    }
});

const getBalanceRequests = asyncHandler(async (req, res) => {
    const demands = await AmountDemand.find({ userID: req.session.userId });

    res.status(200).send(demands);
});

module.exports = {
    requestBalance,
    getBalanceRequests
};