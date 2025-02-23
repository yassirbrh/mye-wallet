// Importations
import AmountDemandController from '../controllers/AmountDemandController';
import UserController from '../controllers/UserController';
import NotificationController from '../controllers/NotificationController';
import ReportController from '../controllers/ReportController';
import CreditCardController from "../controllers/CreditCardController";
import MessageController from '../controllers/MessageController';
import AssistanceController from '../controllers/AssistanceController';
import authProtect from '../middlewares/AuthMiddleware';

const express = require('express');
// End of importations

const router = express.Router();

router.post('/requestbalance', authProtect, AmountDemandController.requestBalance);
router.get('/getbalancerequests', authProtect, AmountDemandController.getBalanceRequests);
router.post('/getusernamebyid', authProtect, UserController.getUsernameById);
router.get('/getnotifications:limit?', authProtect, NotificationController.getNotifications);
router.post('/seenotifications', authProtect, NotificationController.seeNotifications);
router.post('/checknotification', authProtect, NotificationController.checkNotification);
router.get('/getreports', authProtect, ReportController.getReports);
router.post('/createreport', authProtect, ReportController.createReport);
router.post('/requestcreditcard', authProtect, CreditCardController.requestCreditCard);
router.get('/getcreditcards', authProtect, CreditCardController.getCreditCards);
router.post('/handlecreditcardstate', authProtect, CreditCardController.handleCreditCardState);
router.get('/getconversations', authProtect, MessageController.getConversations);
router.post('/sendmessage', authProtect, MessageController.sendMessage);
router.post('/getconversationbyusername', authProtect, MessageController.getConversationByUsername);
router.post('/checkmessages', authProtect, MessageController.checkMessages);
router.get('/getassistance', authProtect, AssistanceController.getAssistance);
router.post('/askassistance', authProtect, AssistanceController.askAssistance);

module.exports = router;
