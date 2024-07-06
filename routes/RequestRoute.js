// Importations
import AmountDemandController from '../controllers/AmountDemandController';
import authProtect from '../middlewares/AuthMiddleware';

const express = require('express');
// End of importations

const router = express.Router();

router.post('/requestbalance', authProtect, AmountDemandController.requestBalance);
router.get('/getbalancerequests', authProtect, AmountDemandController.getBalanceRequests);

module.exports = router;
