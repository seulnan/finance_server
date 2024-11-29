const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// POST /api/transactions - 새 Transaction 생성
router.post('/', async (req, res) => {
  const { avatar, name, category, date, amount, recurring } = req.body;
  try {
    const newTransaction = await Transaction.create({
      avatar,
      name,
      category,
      date,
      amount,
      recurring,
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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
