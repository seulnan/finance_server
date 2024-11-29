const express = require('express');
const router = express.Router();
const { getAvailableOptions } = require('../controllers/budgetController');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

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
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find();

    // Budget과 관련된 Transactions 가져오기
    const budgetsWithTransactions = await Promise.all(
      budgets.map(async (budget) => {
        // 모든 관련 Transactions 가져와서 amount 합계 계산
        const allTransactions = await Transaction.find({ category: budget.name });
        const totalUsed = allTransactions.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

        // 최신 3개의 Transactions 가져오기
        const latestTransactions = allTransactions
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신순 정렬
          .slice(0, 3); // 상위 3개 추출

        return {
          ...budget._doc,
          limit: budget.limit.toFixed(2), // 소수점 두 자리 유지
          used: Math.abs(totalUsed).toFixed(2), // 절대값으로 변환 후 소수점 두 자리 유지
          latestSpending: latestTransactions.map((transaction) => ({
            avatar: transaction.avatar,
            name: transaction.name,
            date: transaction.date,
            amount: transaction.amount.toFixed(2), // 소수점 두 자리 유지
          })),
        };
      })
    );

    res.status(200).json(budgetsWithTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// PATCH /api/budgets/:id - Budget 수정
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, color, limit } = req.body;

  try {
    // Budget 업데이트
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { name, color, limit },
      {
        new: true, // 수정된 데이터를 반환
        runValidators: true, // Mongoose 유효성 검사 실행
        context: "query", // unique 오류 방지
      }
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // 소수점 두 자리로 변환된 데이터 반환
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
