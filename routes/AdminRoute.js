// Importations
import AdminController from '../controllers/AdminController';
import adminProtect from '../middlewares/AdminMiddleware';
import upload from '../middlewares/PhotoUploadMiddleware';

const express = require('express');
// End of importations

const router = express.Router();

router.post('/login', AdminController.loginAdmin);
router.get('/logout', AdminController.logoutAdmin);
router.get('/requests', adminProtect, AdminController.getRequests);
router.post('/acceptuser', adminProtect, AdminController.acceptUser);
router.post('/deleteuser', adminProtect, AdminController.deleteUser);
router.get('/getadmindata', adminProtect, AdminController.getAdminData);
router.post('/createadmin', adminProtect, AdminController.createAdmin);
router.get('/loggedin', AdminController.loginStatusAdmin);
router.get('/getphoto', adminProtect, AdminController.getPhoto);
router.post('/uploadphoto', adminProtect, upload.single('photo'), AdminController.uploadPhoto);
router.post('/updateadmin', adminProtect, AdminController.updateAdmin);
router.post('/changepassword', adminProtect, AdminController.changePassword);
router.get('/getdashboardstats', adminProtect, AdminController.getDashboardStats);
router.get('/reports', adminProtect, AdminController.getReports);
router.get('/getassistancerequests', adminProtect, AdminController.getAssistanceRequests);
router.get('/getamountdemands', adminProtect, AdminController.getAmountDemands);
router.get('/getcreditcards', adminProtect, AdminController.getCreditCards);
router.get('/getadmins', adminProtect, AdminController.getAdmins);
router.post('/managepermissions', adminProtect, AdminController.managePermissions);
router.post('/deleteadmin', adminProtect, AdminController.deleteAdmin);
router.get('/getusers', adminProtect, AdminController.getUsers);
router.post('/process-amount-demands', adminProtect, AdminController.processAmountDemands);
router.post('/check-report', adminProtect, AdminController.checkReport);
router.post('/processcreditcardrequest', adminProtect, AdminController.processCreditCardRequest);
router.post('/process-assistance-request', adminProtect, AdminController.processAssistanceRequest);

module.exports = router;
