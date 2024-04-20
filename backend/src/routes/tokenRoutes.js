const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Route for transferring USDC tokens
router.post('/transfer/usdc', tokenController.transferUSDC);

// Route for transferring Paxos tokens
router.post('/transfer/paxos', tokenController.transferPaxos);

// Route for transferring TUSD tokens
router.post('/transfer/tusd', tokenController.transferTUSD);

// Route for transferring USDT tokens
router.post('/transfer/usdt', tokenController.transferUSDT);

// Route for transferring PAYUSD tokens
router.post('/transfer/payusd', tokenController.transferPAYUSD);

// Add routes for other supported stablecoins as needed

module.exports = router;
