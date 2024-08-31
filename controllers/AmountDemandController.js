import User from '../models/UserModel';
import AmountDemand from '../models/AmountDemandModel';
const asyncHandler = require('express-async-handler');

const requestBalance = asyncHandler(async (req, res) => {
    const userID = req.session.userId;
    const amount = Number(req.body.amount);

    const user = await User.findById(userID);

    if (typeof amount !== 'number') {
        res.status(400).send("Amount should be a number !!")
    }
    else if (user) {
        const doneAt = new Date();
        const newDemand = new AmountDemand({
            userID, amount, doneAt
        });
        newDemand.save();
        res.status(200).send("Demand successfully registered !! pending !!");
    } else {
        res.status(401).send("User Not Found !!");
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