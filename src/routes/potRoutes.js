const express = require('express');
const router = express.Router();
const Pot = require('../models/Pot');

// POST /api/pots - 새 Pot 생성
router.post('/', async (req, res) => {
  const { name, target, total, theme } = req.body;
  try {
    const newPot = await Pot.create({ name, target, total, theme });
    res.status(201).json(newPot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/pots - 모든 Pot 조회
router.get('/', async (req, res) => {
  try {
    const pots = await Pot.find();
    res.status(200).json(pots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
