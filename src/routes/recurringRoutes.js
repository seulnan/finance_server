const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/recurrings - Recurring Transactions 조회
router.get('/', async (req, res) => {
  try {
    const recurrings = await Transaction.find({ recurring: true });

    // 소수점 두 자리를 유지하도록 변환
    const transformedRecurrings = recurrings.map((transaction) => ({
      ...transaction._doc, // Mongoose 문서를 일반 JavaScript 객체로 변환
      amount: transaction.amount.toFixed(2), // amount 소수점 두 자리 유지
    }));

    res.status(200).json(transformedRecurrings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
