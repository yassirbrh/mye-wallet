import User from '../models/UserModel';
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, userName, gender} = req.body;

    if (!firstName || !lastName || !email || !password || !userName || !gender) {
        res.status(400);
        throw new Error("Please fill all the required fields");
    }

    const userNameExists = User.findOne({ userName });
    if (!userNameExists) {
        res.status(400);
        throw new Error("Username has already been registered");
    }
    const emailExists = User.findOne({ email });
    if (!emailExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }
    const user = await User.create({
        firstName, lastName, userName, email, password, gender
    });

    if (user) {
        const { _id, firstName, lastName, userName, email, gender } = user;
        res.status(201).json({
            _id, firstName, lastName, userName, email, gender
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        res.status(400);
        throw new Error("Please enter a username and password !!");
    }

    const user = await User.findOne({ userName });
    if (user) {
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400);
            throw new Error("Password incorrect !!");
        } else if (!user.isAccepted) {
            res.status(400);
            throw new Error("The director didn't accept your request yet !! Please try to login after getting accepted")
        } else {
            const { _id, firstName, lastName, userName, email, gender } = user;

            req.session.userId = _id;
            res.cookie("username", userName, {
                path: "/",
                expires: new Date(Date.now() + 1000 * 86400),
                secure: false
            });
            res.status(200).json({
                _id, firstName, lastName, userName, email, gender
            });
        }
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.sendStatus(500);
        } else {
            res.clearCookie('userName');
            res.redirect('/');
        }
    });
});

const getUser = asyncHandler(async (req, res) => {
    if (req.user) {
        const userAttributes = Object.keys(req.user).reduce((obj, key) => {
            if (key !== '_id') {
                obj[key] = req.user[key];
            }
            return obj;
          }, {});
        res.status(200).json(userAttributes);
    } else {
        res.status(400);
        throw new Error("User Not Found");
    }
});

const loginStatus = asyncHandler(async (req, res) => {
    if (req.session.userId) {
        res.json(true);
    }
    res.json(false);
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus
};