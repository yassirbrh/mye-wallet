// Importations
import AdminController from '../controllers/AdminController';
import adminProtect from '../middlewares/AdminMiddleware';

const express = require('express');
// End of importations

const router = express.Router();

router.post('/login', AdminController.loginAdmin);
router.get('/logout', AdminController.logoutAdmin);
router.get('/requests', adminProtect, AdminController.getRequests);
router.post('/acceptuser', adminProtect, AdminController.acceptUser);
router.post('/deleteuser', adminProtect, AdminController.deleteUser);
//router.get('/getadmindata', AdminController.getAdminData);
router.post('/createadmin', adminProtect, AdminController.createAdmin);

module.exports = router;
