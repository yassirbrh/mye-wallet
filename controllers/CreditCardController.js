import CreditCard from "../models/CreditCardModel";
import User from '../models/UserModel';
const asyncHandler = require('express-async-handler');

const getCreditCards = asyncHandler(async (req, res) => {
    const userID = req.session.userId;

    const creditCards = await CreditCard.find({ userID, state: { $ne: 'pending' } });

    res.status(200).send(creditCards);
});

const requestCreditCard = asyncHandler(async (req, res) => {
    const userID = req.session.userId;
    const { cardType } = req.body;
    const user = await User.findById(userID);

    if (!cardType) {
        return res.status(400).json({ message: "Card type is required." });
    }

    const holderName = `${user.firstName} ${user.lastName}`; // Example; retrieve from user data if needed
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 3); // Set expiration 3 years from now

    let cardNumber;
    let isUnique = false;

    while (!isUnique) {
        cardNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000); // Generate a 16-digit number
        const existingCard = await CreditCard.findOne({ cardNumber });
        if (!existingCard) {
            isUnique = true;
        }
    }

    const newCard = new CreditCard({
        cardNumber,
        userID,
        holderName,
        expDate,
        CVV: Math.floor(100 + Math.random() * 900).toString(), // Generate a 3-digit CVV
        cardType
    });

    await newCard.save();
    return res.status(201).json({ message: "Credit card created successfully.", card: newCard });
});

const handleCreditCardState = asyncHandler(async (req, res) => {
    const cardId = req.body.cardId;

    const card = await CreditCard.findById(cardId);
    if (card.state === "active") card.state = "blocked";
    else card.state = "active";

    await card.save();

    res.status(201).json({ message: "Credit card state changed" });
})


module.exports = { getCreditCards, requestCreditCard, handleCreditCardState };
