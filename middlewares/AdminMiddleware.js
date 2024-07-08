import Admin from "../models/AdminModel";
const asyncHandler = require('express-async-handler');

const adminProtect = asyncHandler(async (req, res, next) => {
    try {
        const session = req.session;

        if (!session) {
            throw new Error('Not Authorized !! please login !!');
        }

        const admin = await Admin.findById(session.adminId).select("-__v -password -isAccepted");
        if (admin) {
            req.admin = admin._doc;
        } else {
            throw new Error('User not found !!');
        }
        next();
    } catch(error) {
        res.status(401).send("Unauthorized");
        console.log(error.message);
    }
});

module.exports = adminProtect;