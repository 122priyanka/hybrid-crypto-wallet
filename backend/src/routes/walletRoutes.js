const express = require('express');
const router = express.Router();
const { getBalance, getHistory } = require('../controllers/walletController');

router.get('/balance/:address', getBalance);
router.get('/history/:address', getHistory);

module.exports = router;
