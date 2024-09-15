// Importations
import AmountDemandController from '../controllers/AmountDemandController';
import UserController from '../controllers/UserController';
import authProtect from '../middlewares/AuthMiddleware';

const express = require('express');
// End of importations

const router = express.Router();

router.post('/requestbalance', authProtect, AmountDemandController.requestBalance);
router.get('/getbalancerequests', authProtect, AmountDemandController.getBalanceRequests);
router.post('/getusernamebyid', authProtect, UserController.getUsernameById);

module.exports = router;
