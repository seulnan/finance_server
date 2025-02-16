const express = require("express");
const router = express.Router();
const Pot = require("../models/Pot");
const { getAvailableColors } = require('../controllers/potController');

// 사용 가능한 색상 가져오기
router.get("/available-colors", getAvailableColors);

// POST /api/pots - 새 Pot 생성
router.post("/", async (req, res) => {
  const { name, target, color } = req.body; // currentAmount는 기본값 0
  try {
    const newPot = await Pot.create({ name, target, currentAmount: 0, color });
    res.status(201).json(newPot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/pots - 모든 Pot 조회
router.get("/", async (req, res) => {
  try {
    const pots = await Pot.find();

    // 소수점 두 자리를 유지하도록 변환
    const transformedPots = pots.map((pot) => ({
      ...pot._doc, // Mongoose 문서를 JavaScript 객체로 변환
      target: pot.target.toFixed(2), // 소수점 두 자리로 변환
      currentAmount: pot.currentAmount.toFixed(2), // 소수점 두 자리로 변환
    }));

    res.status(200).json(transformedPots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Patch /api/pots/:id - Pot 수정
router.patch("/:id", async (req, res) => {
  const { name, target, color } = req.body; // 수정 가능한 필드
  try {
    const updatedPot = await Pot.findByIdAndUpdate(
      req.params.id,
      { name, target, color },
      { new: true, runValidators: true, context: "query", } // 수정된 데이터 반환 및 유효성 검사
    );

    if (!updatedPot) {
      return res.status(404).json({ message: "Pot not found" });
    }

    // 소수점 두 자리를 유지하여 응답
    const transformedPot = {
      ...updatedPot._doc,
      target: updatedPot.target.toFixed(2),
      currentAmount: updatedPot.currentAmount.toFixed(2),
    };

    res.status(200).json(transformedPot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/pots/:id - Pot 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deletedPot = await Pot.findByIdAndDelete(req.params.id);

    if (!deletedPot) {
      return res.status(404).json({ message: "Pot not found" });
    }
    res.status(200).json({ message: "Pot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/pots/:id/add-savings - Add Savings
router.patch("/:id/add-savings", async (req, res) => {
  let amount = req.body.amount;
  console.log("amount (before parsing):", amount, "Type:", typeof amount);

  try {
    const pot = await Pot.findById(req.params.id);
    if (!pot) {
      return res.status(404).json({ message: "Pot not found" });
    }
    
    // amount가 존재하는지 
    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: "Amount is required." });
    }

    // amount를 숫자로 변환하여 처리 & 유효성 검사
    if (typeof amount !== "number") {
      amount = parseFloat(amount);
    }
    console.log("amount (after parsing):", amount, "Type:", typeof amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount. Please enter a positive number." });
    }

    // 새로운 currentAmount 계산
    const newAmount = pot.currentAmount + amount;

    console.log("newAmount:", newAmount);
    
    // target 초과 여부 확인
    if (newAmount > pot.target) {
      return res
        .status(400)
        .json({ message: "Cannot exceed target savings amount." });
    }

    // currentAmount 업데이트
    pot.currentAmount = newAmount;
    await pot.save();

    res.status(200).json({
      message: "Savings added successfully.",
      pot,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/pots/:id/withdraw-savings - Withdraw Savings
router.patch("/:id/withdraw-savings", async (req, res) => {
  const { amount } = req.body;

  try {
    const pot = await Pot.findById(req.params.id);
    if (!pot) {
      return res.status(404).json({ message: "Pot not found" });
    }

    // 새로운 currentAmount 계산
    const newAmount = pot.currentAmount - amount;

    // 음수 여부 확인
    if (newAmount < 0) {
      return res.status(400).json({
        message: `Invalid operation: currentAmount cannot be negative.`,
      });
    }

    // currentAmount 업데이트
    pot.currentAmount = newAmount;
    await pot.save();

    res.status(200).json({
      message: "Savings withdrawn successfully.",
      pot,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;