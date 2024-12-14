// Importations
import UserController from '../controllers/UserController';
import TransactionController from '../controllers/TransactionController';
import authProtect from '../middlewares/AuthMiddleware';
import upload from '../middlewares/PhotoUploadMiddleware';

const express = require('express');
// End of importations

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', UserController.logoutUser);
router.get('/getuser', authProtect, UserController.getUser);
router.get('/loggedin', UserController.loginStatus);
router.post('/updateuser', authProtect, UserController.updateUser);
router.post('/changepassword', authProtect, UserController.changePassword);
router.post('/uploadphoto', authProtect, upload.single('photo'), UserController.uploadPhoto);
router.get('/getphoto', authProtect, UserController.getPhoto);
router.get('/gettransactions:limit?', authProtect, TransactionController.getTransactions);
router.post('/transfer', authProtect, TransactionController.transferMoney);
router.get('/cacheloadtransactions', authProtect, TransactionController.cacheLoadTransactions);
router.get('/getcachedtransactions', authProtect, TransactionController.getCachedTransactions);

module.exports = router;
