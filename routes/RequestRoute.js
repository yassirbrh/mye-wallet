// Importations
import AmountDemandController from '../controllers/AmountDemandController';
import UserController from '../controllers/UserController';
import NotificationController from '../controllers/NotificationController';
import authProtect from '../middlewares/AuthMiddleware';

const express = require('express');
// End of importations

const router = express.Router();

router.post('/requestbalance', authProtect, AmountDemandController.requestBalance);
router.get('/getbalancerequests', authProtect, AmountDemandController.getBalanceRequests);
router.post('/getusernamebyid', authProtect, UserController.getUsernameById);
router.get('/getnotifications:limit?', authProtect, NotificationController.getNotifications);
router.post('/seenotifications', authProtect, NotificationController.seeNotifications);

module.exports = router;
