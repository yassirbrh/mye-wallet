import Message from '../models/MessageModel';
import User from '../models/UserModel';
import Notification from '../models/NotificationModel';
const asyncHandler = require('express-async-handler');

const getConversations = asyncHandler(async (req, res) => {
    const userID = req.session.userId;

    // Fetch all messages involving the user
    const messages = await Message.find({
        $or: [
            { senderID: userID },
            { receiverID: userID }
        ]
    });

    const conversations = {};

    for (const message of messages) {
        const counterpartID = message.senderID.toString() === userID.toString() 
            ? message.receiverID 
            : message.senderID;

        // Check if we already have the counterpart's username
        if (!conversations[counterpartID]) {
            const counterpartUser = await User.findById(counterpartID).select("userName");
            const counterpartUserName = counterpartUser ? counterpartUser.userName : "Unknown User";

            conversations[counterpartID] = {
                counterpartUserName,
                messages: []
            };
        }

        // Add the message to the conversation with isMyMessage attribute
        conversations[counterpartID].messages.push({
            ...message.toObject(), // Ensure it's a plain object
            isMyMessage: message.senderID.toString() === userID.toString()
        });
    }

    res.status(201).send(conversations);
});


const sendMessage = asyncHandler(async (req, res) => {
    const userID = req.session.userId;
    const receiverUsername = req.body.receiverUsername;
    const content = req.body.content

    const receiver = await User.findOne({ userName: receiverUsername });
    const message = await Message.create({ senderID: userID, receiverID: receiver._id, content });
    const truncatedContent = content.length <= 10 ? content : `${content.substring(0, 10)}...`;

    const notification = new Notification({
        userID: receiver._id,
        notifMessage: `You've received a message from ${receiverUsername}: ${truncatedContent}`,
        type: 'Message',
        notifID: message._id,
    });
    await notification.save();

    res.status(201).send({ message: 'Message sent'})
});

const getConversationByUsername = asyncHandler(async (req, res) => {
    const userID = req.session.userId;
    const userName = req.body.userName;

    const receiver = await User.findOne({ userName });

    if (!receiver) {
        return res.status(404).send({ message: "User not found" });
    }

    const messages = await Message.find({
        $or: [
            { senderID: userID, receiverID: receiver._id },
            { receiverID: userID, senderID: receiver._id }
        ]
    })
        //.sort({ doneAt: -1 })
        .lean(); // Use `.lean()` to make the data mutable

    const updatedMessages = messages.map(message => {
        if (message.senderID.toString() !== userID.toString()) {
            return {
                ...message,
                senderUsername: userName, // Add the sender's username if it's not the current user
            };
        }
        return message;
    });

    res.status(201).send(updatedMessages);
});

const checkMessages = asyncHandler(async (req, res) => {
    const userName = req.body.userName;
    const userID = req.session.userId;
  
    try {
      const sender = await User.findOne({ userName });
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }
  
      // Update all those messages to set `isSeen` to true
      await Message.updateMany(
        { senderID: sender._id, receiverID: userID, isSeen: false },
        { $set: { isSeen: true } }
      );
  
      res.status(200).send('Messages checked successfully !!'); // Optionally send the updated messages
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error });
    }
  });
  
module.exports = { getConversations, sendMessage, getConversationByUsername, checkMessages }