import User from '../models/UserModel';
const asyncHandler = require('express-async-handler');

const authProtect = asyncHandler(async (req, res) => {
    try {
        const session = req.session;

        if (!session) {
            throw new Error('Not Authorized !! please login !!');
        }

        const user = User.findById(session.userId).select("-__v -password -isAccepted");
        if (user) {
            req.user = user._doc;
        } else {
            throw new Error('User not found !!');
        }
        next();
    } catch(error) {
        res.status(401);
        throw new Error(error.message);
    }
});

module.exports = authProtect;