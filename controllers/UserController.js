import User from '../models/UserModel';
import File from '../models/FileModel';
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, userName, gender, birthDate} = req.body;

    if (!firstName || !lastName || !email || !password || !userName || !gender || !birthDate) {
        res.status(400);
        throw new Error("Please fill all the required fields");
    }

    const userNameExists = await User.findOne({ userName });
    if (userNameExists !== null) {
        res.status(400);
        throw new Error("Username has already been registered");
    }
    const emailExists = await User.findOne({ email });
    if (emailExists !== null) {
        res.status(400);
        throw new Error("Email has already been registered");
    }
    const user = await User.create({
        firstName, lastName, userName, email, password, gender, birthDate
    });

    if (user) {
        const { _id, firstName, lastName, userName, email, gender, birthDate } = user;
        res.status(201).json({
            _id, firstName, lastName, userName, email, gender, birthDate
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
            res.status(200).json({
                _id, firstName, lastName, userName, email, gender
            });
        }
    } else {
        res.status(400);
        throw new Error('Invalid username !!');
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.sendStatus(500);
        } else {
            res.clearCookie('userconnect.sid');
            res.sendStatus(200);
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
    } else {
        res.json(false);
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.userId);
    const allowedAttributes = ['firstName', 'lastName', 'email', 'birthDate'];

    if (!user) {
        res.status(404).send('User not found !!');
    } else {
        allowedAttributes.forEach(attribute => {
            if (req.body[attribute] !== undefined) {
                user[attribute] = req.body[attribute];
            }
        });
        const updatedUser = await user.save();

        res.status(200).json({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            photo: updatedUser.photo,
            birthDate: updatedUser.birthDate
        });
    }
});

const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.userId);

    if (!user) {
        res.status(404).send('User not found !!');
    }

    const { oldPassword, password } = req.body;
  
    // Validate
    if (!oldPassword || !password) {
      res.status(400).send("Please add old and new password");
    }
  
    // Check if old password matches password in DB
    const passwordIsCorrect = await bcryptjs.compare(oldPassword, user.password);
  
    // Save new password
    if (passwordIsCorrect) {
      user.password = password;
      await user.save();
      res.status(200).send("Password change successful");
    } else {
      res.status(400);
      throw new Error("Old password is incorrect");
    }
});

const uploadPhoto = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const file = await File.findOne({ userId: req.session.userId, type: 'ProfilePhoto' });
        const imageBuffer = req.file.buffer;
        const contentType = req.file.mimetype;
        const type = 'ProfilePhoto';

        if (user) {
            if (file) {
                file['data'] = imageBuffer;
                file['contentType'] = contentType;
                await file.save();
            } else {
                const newFile = new File({
                    userId: req.session.userId,
                    data: imageBuffer,
                    type,
                    contentType
                });
                await newFile.save();
            }

            res.status(201).send('Image uploaded successfully');
        } else {
            res.status(404).send('User not found !!');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const getPhoto = asyncHandler(async (req, res) => {
    try {
        // Find the user by userId
        const user = await User.findById(req.session.userId);
        const file = await File.findOne({ userId: req.session.userId, type: 'ProfilePhoto'});

        // Check if user exists and has a photo
        if (!user || !file) {
            return res.status(404).send('Image not found');
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

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    uploadPhoto,
    getPhoto
};