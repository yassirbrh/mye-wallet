import Admin from '../models/AdminModel';
import User from '../models/UserModel';
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
            res.status(400);
            throw new Error("Password incorrect !!");
        } else {
            const { _id, firstName, lastName, userName, email, gender, privileges } = admin;
            req.session.adminId = _id;
            req.session.adminPrivileges = privileges;
            req.session.adminUsername = userName;
            res.status(200).json({
                message: `${admin.userName} is logged in !!`,
                data: {_id, firstName, lastName, userName, email, gender}
            });
        }
    } else {
        res.status(400);
        throw new Error("Invalid admin !!");
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

const getRequests = asyncHandler(async (req, res) => {
    const requests = await User.find({ isAccepted: false });

    res.status(200).json({ requests });
});

const acceptUser = asyncHandler(async (req, res) => {
    const privileges = req.session.adminPrivileges;
    const adminUsername = req.session.adminUsername;
    const { userId } = req.body;

    if (adminUsername === "administrator" || privileges.includes("C")) {
        const user = await User.findById(userId);

        user["isAccepted"] = true;
        await user.save();

        res.status(200).send({ message: `${user.userName} is updated`});
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const privileges = req.session.adminPrivileges;
    const adminUsername = req.session.adminUsername;
    const { userId } = req.body;

    if (adminUsername === "administrator" || privileges.includes("D")) {
        const user = await User.findOne({ _id: userId });
        if (user) {
            const username = user.userName;
            await User.deleteOne({ _id: userId });
            res.status(200).send({ message: `${username} is deleted successfully !!`});
        }
    }
});

const getAdminData = asyncHandler(async (req, res) => {

    const adminData = await Admin.find();

    res.status(200).send(adminData);
});

const createAdmin = asyncHandler(async (req, res) => {
    const adminUsername = req.session.adminUsername;
    const adminPrivileges = req.session.adminPrivileges;

    if (adminUsername === "administrator" || (adminPrivileges['employees']  && adminPrivileges['employees'].includes("C"))) {
        const { firstName, lastName, userName, email, password, gender, privileges, adminType, birthDate } = req.body;

        const userNameExists = await Admin.findOne({ userName });

        if (userNameExists !== null) {
            res.status(400);
            throw new Error("Admin username has already been registered");
        }

        const emailExists = await Admin.findOne({ email });

        if (emailExists !== null) {
            res.status(400);
            throw new Error("Email has already been registered");
        }

        const admin = await Admin.create({
            firstName, lastName, userName, email, password, gender, privileges, adminType, birthDate
        });

        if (admin) {
            const { _id, firstName, lastName, userName, email, gender, birthDate } = admin;
            res.status(201).json({
                _id, firstName, lastName, userName, email, gender, birthDate
            });
        } else {
            res.status(400);
            throw new Error("Invalid admin data");
        }
    }
});

module.exports = {
    loginAdmin,
    logoutAdmin,
    getRequests,
    acceptUser,
    deleteUser,
    getAdminData,
    createAdmin
}
