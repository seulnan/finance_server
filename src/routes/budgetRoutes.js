const express = require('express');
const router = express.Router();
const { getAvailableOptions } = require('../controllers/budgetController');
const Budget = require('../models/Budget');

// 사용 가능한 옵션 가져오기
router.get('/available-options', getAvailableOptions);

// POST /api/budgets - 새 Budget 생성
router.post("/", async (req, res) => {
    const { name, color, limit } = req.body;
    try {
        const newBudget = await Budget.create({ name, color, limit });
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/budgets - 모든 Budget 조회
router.get("/", async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/budgets/:id - Budget 수정
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, color, limit } = req.body;
    try {
        const updatedBudget = await Budget.findByIdAndUpdate(
            id,
            { name, color, limit },
            { new: true }
        );
        if (!updatedBudget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/budgets/:id - Budget 삭제
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBudget = await Budget.findByIdAndDelete(id);
        if (!deletedBudget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

