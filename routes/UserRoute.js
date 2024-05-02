// Importations
import UserController from '../controllers/UserController';
import authProtect from '../middlewares/AuthMiddleware';

const express = require('express');
// End of importations

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', UserController.logoutUser);
router.get('/getuser', authProtect, UserController.getUser);
router.get('/loggedin', UserController.loginStatus)

module.exports = router;
