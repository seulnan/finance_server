const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/recurrings - Recurring Transactions 조회
router.get('/', async (req, res) => {
  try {
    const recurrings = await Transaction.find({ recurring: true });
    res.status(200).json(recurrings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
