import User from '../models/UserModel';
import File from '../models/FileModel';
import redisClient from '../cache/redisClient';
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, userName, gender, birthDate} = req.body;
    try  {
        if (!firstName || !lastName || !email || !password || !userName || !gender || !birthDate) {
            throw new Error("Please fill all the required fields");
        }

        const userNameExists = await User.findOne({ userName });
        if (userNameExists !== null) {
            throw new Error("Username has already been registered");
        }
        const emailExists = await User.findOne({ email });
        if (emailExists !== null) {
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
            throw new Error("Invalid user data");
        }
    } catch(error) {
        res.status(400).json({ message: error.toString() });
        console.log(error.toString())
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;


    try {
        if (!userName || !password) {
            throw new Error("Please enter a username and password !!");
        }

        const user = await User.findOne({ userName });
        if (user) {
            const isPasswordCorrect = await bcryptjs.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new Error("Password incorrect !!");
            } else if (!user.isAccepted) {
                throw new Error("The director didn't accept your request yet !! Please try to login after getting accepted")
            } else {
                const { _id, firstName, lastName, userName, email, gender } = user;

                req.session.userId = _id;
                res.status(200).json({
                    _id, firstName, lastName, userName, email, gender
                });
            }
        } else {
            throw new Error('Invalid username !!');
        }
    } catch(error) {
        res.status(400).json({message: error.toString()});
        console.log(error.toString());
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.session.userId; // Retrieve user ID from session

    if (!userId) {
        return res.status(400).send({ message: "User not authenticated" });
    }

    // Define cache key pattern
    const cacheKeyPattern = `*${userId}*`;

    try {
        // Retrieve all keys matching the user ID pattern
        const keys = await redisClient.keys(cacheKeyPattern);

        // Delete all matching keys
        if (keys.length > 0) {
            await redisClient.del(keys);
        }

        // Destroy the session and clear the cookie
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send({ message: 'Error logging out' });
            }
            res.clearCookie('userconnect.sid');
            res.sendStatus(200);
        });
    } catch (error) {
        console.error('Error clearing cache during logout:', error);
        res.status(500).send({ message: 'Error logging out' });
    }
});

const getUser = asyncHandler(async (req, res) => {
    if (req.user) {
        const userAttributes = Object.keys(req.user).reduce((obj, key) => {
            obj[key] = req.user[key];
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
    const allowedAttributes = ['firstName', 'lastName', 'email'];

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
      res.status(400).send("Old password is incorrect");
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


const getPhotoByUsername = asyncHandler(async (req, res) => {
    try {
        // Find the user by userId
        const user = await User.findOne({ userName: req.body.userName});

        // Check if user exists and has a photo
        if (!user) {
            return res.status(404).send('User not found');
        }

        const file = await File.findOne({ userId: user._id, type: 'ProfilePhoto'});

        if (!file) {
            return res.status(404).send('Image not found')
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


const getUsernameById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.body.operatorID);

        res.status(200).send({ operatorUsername: user.userName });
    } catch (error) {
        console.log(error);
        res.status(400).send({message: 'User not found !!'});
    }
});


const getMyBeneficiaries = asyncHandler(async (req, res) => {
    try {
        const myUser = await User.findById(req.session.userId);
        const myBeneficiaries = myUser.Beneficiaries;
        const listOfBeneficiaries = [];

        for (const index in myBeneficiaries) {
            const user = await User.findOne({ userName: myBeneficiaries[index] });
            if (user) {
                const userObj = {
                    userName: user.userName,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
                listOfBeneficiaries.push(userObj);
            }
        }

        res.status(200).send({ listOfBeneficiaries });
    } catch (error) {
        console.log(error);
        res.status(400).send({message: 'Error !!'});
    }
});

const searchBeneficiaries = asyncHandler(async (req, res) => {
    try {
        const beneficiariePattern = req.body.beneficiariePattern;
        if (!beneficiariePattern) {
            return res.status(400).send({ message: 'Pattern is required!' });
        }

        // Search for users whose username starts with the pattern (case-insensitive)
        const matchingUsers = await User.find({
            userName: { $regex: `^${beneficiariePattern}`, $options: 'i' }
        }).select('userName firstName lastName');

        // Format response
        const listOfBeneficiaries = matchingUsers.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName
        }));

        res.status(200).send({ listOfBeneficiaries });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Error fetching beneficiaries!' });
    }
});


const addBeneficiarie = asyncHandler(async (req, res) => {
    try {
        const beneficiarieUsername = req.body.userName;
        const userId = req.session.userId;
        const user = await User.findById(userId);

        user.Beneficiaries.push(beneficiarieUsername);
        await user.save();

        res.status(200).send({ message: 'Beneficiarie Added !!'});
    } catch(error) {
        res.status(400).send({message: 'Error !!'});
    }
});

const deleteBeneficiarie = asyncHandler(async (req, res) => {
    try {
        const beneficiarieUsername = req.body.userName;
        const userId = req.session.userId;
        const user = await User.findById(userId);

        user.Beneficiaries = user.Beneficiaries.filter(
            (beneficiary) => beneficiary !== beneficiarieUsername
        );
        await user.save();

        res.status(200).send({ message: 'Beneficiarie Added !!'});
    } catch(error) {
        res.status(400).send({ message: `Error !! ${error.message}`});
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
    getPhoto,
    getUsernameById,
    getMyBeneficiaries,
    getPhotoByUsername,
    searchBeneficiaries,
    addBeneficiarie,
    deleteBeneficiarie
};