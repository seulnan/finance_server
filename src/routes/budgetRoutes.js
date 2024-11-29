const express = require('express');
const router = express.Router();
const { getAvailableOptions } = require('../controllers/budgetController');
const Budget = require('../models/Budget');

// 사용 가능한 옵션 가져오기
router.get('/available-options', getAvailableOptions);

// POST /api/budgets - 새 Budget 생성
router.post('/', async (req, res) => {
  const { name, color, limit } = req.body;
  try {
    const newBudget = await Budget.create({ name, color, limit, used: 0 }); // 기본 used는 0
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/budgets - 모든 Budget 조회
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find();

    // 소수점 두 자리 유지
    const transformedBudgets = budgets.map((budget) => ({
      ...budget._doc,
      limit: budget.limit.toFixed(2), // limit 소수점 두 자리 유지
      used: budget.used.toFixed(2), // used 소수점 두 자리 유지
    }));

    res.status(200).json(transformedBudgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Patch /api/budgets/:id - Budget 수정
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, color, limit } = req.body;
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { name, color, limit },
      { new: true, runValidators: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // 소수점 두 자리를 유지한 데이터 반환
    const transformedBudget = {
      ...updatedBudget._doc,
      limit: updatedBudget.limit.toFixed(2),
      used: updatedBudget.used.toFixed(2),
    };

    res.status(200).json(transformedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/budgets/:id - Budget 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBudget = await Budget.findByIdAndDelete(id);
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
