const express = require("express");
const router = express.Router();
const Overview = require("../models/Overview");

// GET /api/overview - 현재 Overview 조회
router.get("/", async (req, res) => {
    try {
        const overview = await Overview.findOne(); // 하나의 데이터만 가져옴
        if (!overview) {
        return res.status(404).json({ message: "Overview data not found" });
        }

        // 소수점 두 자리 유지
        res.status(200).json({
        currentBalance: overview.currentBalance.toFixed(2),
        income: overview.income.toFixed(2),
        expenses: overview.expenses.toFixed(2),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;