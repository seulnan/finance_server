const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');


// GET /api/transactions - 모든 Transaction 조회
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
