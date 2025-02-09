import Assistance from "../models/AssistanceModel";
const asyncHandler = require('express-async-handler');

const getAssistance = asyncHandler(async (req, res) => {
    const userID = req.session.userId;

    // Check if userID is provided
    if (!userID) {
        return res.status(400).send({ message: "User ID is required." });
    }

    // Find the assistance record for the user
    const assistance = await Assistance.findOne({ userID });

    // Check if the assistance record exists
    if (!assistance) {
        return res.status(404).send({ message: "No assistance record found for this user." });
    }

    // Return the assistance record
    return res.status(200).send(assistance);
});

const askAssistance = asyncHandler(async (req, res) => {
    const userID = req.session.userId;
    const { content } = req.body; // Assuming senderID and content are provided in the request body

    // Validate input
    if (!userID || !content) {
        return res.status(400).send({ message: "userID and content are required." });
    }

    try {
        // Check if an Assistance record already exists for the user
        let assistance = await Assistance.findOne({ userID });

        if (assistance) {
            // If the record exists, push the new message into the messages array
            assistance.messages.push({ senderID: userID, content });
        } else {
            // If the record doesn't exist, create a new one with the message
            assistance = new Assistance({
                userID,
                messages: [{ senderID: userID, content }]
            });
        }

        // Save the updated or new Assistance record
        await assistance.save();

        // Send a success response
        return res.status(201).send({ message: "Message added successfully.", assistance });
    } catch (error) {
        console.error("Error in askAssistance:", error);
        return res.status(500).send({ message: "An error occurred while processing your request." });
    }
});

module.exports = { getAssistance, askAssistance };
