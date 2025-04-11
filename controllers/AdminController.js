import Admin from '../models/AdminModel';
import User from '../models/UserModel';
import File from '../models/FileModel';
import Report from '../models/ReportModel';
import CreditCard from '../models/CreditCardModel';
import Transaction from '../models/TransactionModel';
import Assistance from '../models/AssistanceModel';
import AmountDemand from '../models/AmountDemandModel';
import Notification from '../models/NotificationModel';
const bcryptjs = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const loginAdmin = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        res.status(400);
        throw new Error("Please enter a username and password !!");
    }

    const admin = await Admin.findOne({ userName });

    if (admin) {
        const isPasswordCorrect = await bcryptjs.compare(password, admin.password);
        if (!isPasswordCorrect) {
            res.status(400).json({message: "Password incorrect !!"});
        } else {
            const { _id, firstName, lastName, userName, email, gender, adminType } = admin;
            req.session.adminId = _id;
            req.session.adminType = adminType;
            req.session.adminUsername = userName;
            res.status(200).json({
                message: `${admin.userName} is logged in !!`,
                data: {_id, firstName, lastName, userName, email, gender}
            });
        }
    } else {
        res.status(400).json({message: 'Invalid Admin !!'});
    }
});

const logoutAdmin = asyncHandler(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.sendStatus(500);
        } else {
            res.clearCookie("adminconnect.sid");
            res.sendStatus(200);
        }
    });
});

const loginStatusAdmin = asyncHandler(async (req, res) => {
    if (req.session.adminId) {
        res.json(true);
    } else {
        res.json(false);
    }
})

const getRequests = asyncHandler(async (req, res) => {
    const requests = await User.find({ isAccepted: false });

    res.status(200).json(requests);
});

const getReports = asyncHandler(async (req, res) => { 
    const reports = await Report.find()
        .populate("userID", "userName firstName lastName"); // Fetch user details

    res.status(200).json(reports);
});

const getAssistanceRequests = asyncHandler(async (req, res) => {
    const assistanceRequests = await Assistance.find({}).lean()
        .populate("userID", "userName firstName lastName"); // Fetch all records
    const userIDs = new Set((await User.find({}, "_id")).map(user => user._id.toString())); // Get all user IDs

    const filteredRequests = assistanceRequests.filter(assistance => 
        assistance.messages.length > 0 && userIDs.has(assistance.messages[assistance.messages.length - 1].senderID.toString())
    );

    res.status(200).json(filteredRequests);
});

const getAmountDemands = asyncHandler(async (req, res) => {
    const amountDemands = await AmountDemand.find()
        .populate("userID", "userName firstName lastName");
    res.status(200).json(amountDemands);
});

const getCreditCards = asyncHandler(async (req, res) => {
    const creditcards = await CreditCard.find({ state: 'pending' })
        .populate("userID", "userName firstName lastName");
    res.status(200).json(creditcards)
});


const acceptUser = asyncHandler(async (req, res) => {
    const adminType = req.session.adminType;
    const adminUsername = req.session.adminUsername;
    const { userName } = req.body;

    if (adminUsername === "administrator" || adminType === "System Administrator" || adminType === "Operation Manager") {
        const user = await User.findOne({ userName });

        user.isAccepted = true;
        await user.save();

        res.status(200).send({ message: `${user.userName} is updated`});
    } else {
        res.status(400).send({ message: 'Not Authorized !!'})
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const adminUsername = req.session.adminUsername;
    const adminType = req.session.adminType;
    const { userName } = req.body;

    if (adminUsername === "administrator" || adminType === 'System Administrator' || adminType === 'Operation Manager') {
        const user = await User.findOne({ userName });
        if (user) {
            const username = user.userName;
            await User.deleteOne({ userName });
            res.status(200).send({ message: `${username} is deleted successfully !!`});
        }
    } else {
        res.status(400).send({ message: 'Not Authorized !!'})
    }
});

const updateAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.session.adminId);
    const allowedAttributes = ['firstName', 'lastName', 'email'];

    if (!admin) {
        res.status(404).send('Admin not found !!');
    } else {
        allowedAttributes.forEach(attribute => {
            if (req.body[attribute] !== undefined) {
                admin[attribute] = req.body[attribute];
            }
        });
        const updatedAdmin = await admin.save();

        res.status(200).json({
            firstName: updatedAdmin.firstName,
            lastName: updatedAdmin.lastName,
            email: updatedAdmin.email,
            photo: updatedAdmin.photo,
            birthDate: updatedAdmin.birthDate
        });
    }
});

const managePermissions = asyncHandler(async (req, res) => {
    const adminUsername = req.session.adminUsername;
    const userName = req.body.userName;
    const adminType = req.body.adminType

    if (adminUsername === 'administrator') {
        const admin = await Admin.findOne({ userName });
        admin.adminType = adminType;
        await admin.save();
        res.status(200).send({ message: "Admin Type Updated Successfully !!"});
    } else {
        res.status(400).send({ message: 'Not Authorized !!'});
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.session.adminId);

    if (!admin) {
        res.status(404).send('Admin not found !!');
    }

    const { oldPassword, password } = req.body;
  
    // Validate
    if (!oldPassword || !password) {
      res.status(400).send("Please add old and new password");
    }
  
    // Check if old password matches password in DB
    const passwordIsCorrect = await bcryptjs.compare(oldPassword, admin.password);
  
    // Save new password
    if (passwordIsCorrect) {
      admin.password = password;
      await admin.save();
      res.status(200).send("Password change successful");
    } else {
      res.status(400).send("Old password is incorrect");
    }
});

const getAdminData = asyncHandler(async (req, res) => {
    if (req.admin) {
        const adminAttributes = Object.keys(req.admin).reduce((obj, key) => {
            obj[key] = req.admin[key];
            return obj;
          }, {});
        res.status(200).json(adminAttributes);
    } else {
        res.status(400).json({message: "User Not Found"});
    }
});

const createAdmin = asyncHandler(async (req, res) => {
    const adminUsername = req.session.adminUsername;

    if (adminUsername === "administrator") {
        const { firstName, lastName, userName, email, password, gender, adminType, birthDate } = req.body;

        const userNameExists = await Admin.findOne({ userName });

        if (userNameExists !== null) {
            res.status(400).json({message: "Admin username has already been registered"});
        }

        const emailExists = await Admin.findOne({ email });

        if (emailExists !== null) {
            res.status(400).json({message: "Email has already been registered"});
        }

        const admin = await Admin.create({
            firstName, lastName, userName, email, password, gender, adminType, birthDate
        });

        if (admin) {
            const { _id, firstName, lastName, userName, email, gender, birthDate } = admin;
            res.status(201).json({
                _id, firstName, lastName, userName, email, gender, birthDate
            });
        } else {
            res.status(400).json({message: "Invalid admin data"});
        }
    }
});

const deleteAdmin = asyncHandler(async (req, res) => {
    const adminUsername = req.session.adminUsername;
    
    if (adminUsername === 'administrator') {
        const userName = req.body.userName;
        if (userName === 'administrator') {
            res.status(400).json({ message: 'Not Authorized !!'});
        }
        await Admin.deleteOne({ userName });
        res.status(200).json({ message: 'Admin Deleted Successfully !!'});
    }
})

const uploadPhoto = asyncHandler(async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId);
        const file = await File.findOne({ userId: req.session.adminId, type: 'ProfilePhoto' });
        const imageBuffer = req.file.buffer;
        const contentType = req.file.mimetype;
        const type = 'ProfilePhoto';

        if (admin) {
            if (file) {
                file['data'] = imageBuffer;
                file['contentType'] = contentType;
                await file.save();
            } else {
                const newFile = new File({
                    userId: req.session.adminId,
                    data: imageBuffer,
                    type,
                    contentType
                });
                await newFile.save();
            }

            res.status(201).send('Image uploaded successfully');
        } else {
            res.status(404).send('Admin not found !!');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const getPhoto = asyncHandler(async (req, res) => {
    try {
        // Find the user by userId
        const admin = await Admin.findById(req.session.adminId);
        const file = await File.findOne({ userId: req.session.adminId, type: 'ProfilePhoto'});

        // Check if user exists and has a photo
        if (!admin || !file) {
            return res.status(404).json({message:'Image not found'});
        }

        // Set the appropriate content type in the response headers
        res.set('Content-Type', file.contentType); // Assuming the photo is JPEG format

        // Send the image data
        res.send(file.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({ isAccepted: true });
        const reports = await Report.find();
        const creditcards = await CreditCard.find({ state: "active" });
        const transactions = await Transaction.find({ isDone: true });
        const data = {
            'users': users.length,
            'reports': reports.length,
            'creditcards': creditcards.length,
            'transactions': 0
        }
        for (const transaction of transactions) {
            data['transactions'] += transaction.transactionBalance;
        }
        data['transactions'] = data['transactions'].toFixed(2)
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.toString() })
    }
});

const getAdmins = asyncHandler(async (req, res) => {
    const adminUsername = req.session.adminUsername;
    const adminType = req.session.adminType;

    if (adminUsername === "administrator" || adminType === "System Administrator" || adminType === "Operation Manager") {
        const admins = await Admin.find({ userName: { $ne: "administrator" } });
        res.status(200).json(admins)
    }
    else {
        res.status(400).json({ message: "Access Not Allowed !!"});
    }
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ isAccepted: true });

    res.status(200).json(users);
});

const processAmountDemands = asyncHandler(async (req, res) => {
    const { adminUsername, adminType } = req.session;
    const { demandID, action } = req.body;

    if (adminUsername === 'administrator' || adminType === 'System Administrator' || adminType === 'Operation Manager') {
        try {
            const amountdemand = await AmountDemand.findById(demandID);
            if (!amountdemand) throw new Error('The demand ID is incorrect');
            if (action === 'accept') {
                amountdemand.state = 'accepted';
                const user = await User.findById(amountdemand.userID);
                user.balance += amountdemand.amount;
                await user.save();
                await amountdemand.save();
                const notification = new Notification({
                    userID: amountdemand.userID,
                    notifMessage: `Your request for ${amountdemand.amount} has been accepted and added to your balance`,
                    type: 'Amount Demand',
                    notifID: amountdemand._id,
                });
                await notification.save();
            } else if (action === 'deny') {
                amountdemand.state = 'denied';
                await amountdemand.save();
                const notification = new Notification({
                    userID: amountdemand.userID,
                    notifMessage: `Your request for ${amountdemand.amount} has been denied`,
                    type: 'Amount Demand',
                    notifID: amountdemand._id,
                });
                await notification.save();
            } else throw new Error('This action is invalid !!');
            res.status(200).json({ message: 'Amount Demand Processed Successfully !!'});
        } catch (error) {
            res.status(400).json({ message: error.toString()});
        }
    }
});

const checkReport = asyncHandler(async (req, res) => {
    const { adminUsername, adminType } = req.session;

    if (adminUsername === 'administrator' || adminType === 'System Administrator' || adminType === 'Operation Manager') {
        const { reportID, responseText } = req.body;

        const report = await Report.findById(reportID);

        report.state = 'answered';
        report.answer = responseText;

        await report.save();

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB"); // Formats as "dd/mm/yyyy"
        };
        
        const notification = new Notification({
            userID: report.userID,
            notifMessage: `Your report of ${formatDate(report.doneAt)} has been checked. ${report.reportMessage.length > 10 ? report.reportMessage.slice(0, 10) + "..." : report.reportMessage}`,
            type: 'Report',
            notifID: report._id,
        });                
        await notification.save();
        res.status(200).json({ message: 'Report Checked !!'})
    } else {
        res.status(400).json({ message: 'Action Not Allowed !!'});
    }
});

const processCreditCardRequest = asyncHandler(async (req, res) => {
    const { adminUsername, adminType } = req.session;

    if ( adminUsername === 'administrator' || adminType === 'System Administrator' || adminType === 'Operation Manager') {
        const { cardId, action } = req.body;

        const creditcard = await CreditCard.findById(cardId);

        if (!creditcard) res.status(400).json({ message: 'Credit Card Not Available !!'});
        if (action === 'accept') {
            creditcard.state = 'active';
            await creditcard.save();
            const notification = new Notification({
                userID: creditcard.userID,
                notifMessage: `Your credit card ending in ${creditcard.cardNumber.toString().slice(-4)} has been activated. Expiry: ${new Date(creditcard.expDate).toLocaleDateString("en-GB", { year: "2-digit", month: "2-digit", timeZone: "UTC" })}.`,
                type: 'Credit Card',
                notifID: creditcard._id,
            });                
            await notification.save();
            res.status(200).json({ message: 'Credit Card Activated !!'});
        } else if (action === 'deny') {
            const creditcard = await CreditCard.findById(cardId);
            const { userID, cardNumber } = creditcard;
            await CreditCard.findByIdAndDelete(cardId);
            const notification = new Notification({
                userID,
                notifMessage: `Your credit card ending in ${cardNumber.toString().slice(-4)} request has been rejected.`,
                type: 'Credit Card',
                notifID: cardId,
            });                
            await notification.save();
            res.status(200).json({ message: 'Credit Card Request Rejected !!'});
        } else res.status(400).json({ message: 'Action Not Avalaible !!'});
    } else res.status(400).json({ message: 'Action Not Allowed !!'})
});

const processAssistanceRequest = asyncHandler(async (req, res) => {
    const { adminUsername, adminType } = req.session;

    if (adminUsername === 'administrator' || adminType === 'System Administrator' || adminType === 'Operation Manager') {
        const { assistanceID, content } = req.body;

        try {
            // Check if an Assistance record already exists for the user
            let assistance = await Assistance.findById(assistanceID);
            const admin = await Admin.findOne({ userName: adminUsername })
    
            if (assistance) {
                // If the record exists, push the new message into the messages array
                assistance.messages.push({ senderID: admin._id, content });
            }
    
            // Save the updated or new Assistance record
            await assistance.save();
            const notification = new Notification({
                userID: assistance.userID,
                notifMessage: `Your assistance request is responded by the team, click to check the response !!`,
                type: 'Assistance',
                notifID: assistanceID,
            });                
            await notification.save();
    
            // Send a success response
            return res.status(201).send({ message: "Message added successfully.", assistance });
        } catch (error) {
            console.error("Error in process Assistance:", error);
            return res.status(500).send({ message: "An error occurred while processing your request." });
        }
    }
})

module.exports = {
    loginAdmin,
    logoutAdmin,
    getRequests,
    acceptUser,
    deleteUser,
    getAdminData,
    createAdmin,
    loginStatusAdmin,
    getPhoto,
    uploadPhoto,
    updateAdmin,
    changePassword,
    getDashboardStats,
    getReports,
    getAssistanceRequests,
    getAmountDemands,
    getCreditCards,
    getAdmins,
    managePermissions,
    deleteAdmin,
    getUsers,
    processAmountDemands,
    checkReport,
    processCreditCardRequest,
    processAssistanceRequest
}
