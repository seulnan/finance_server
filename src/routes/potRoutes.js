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
      { new: true, runValidators: true } // 수정된 데이터 반환 및 유효성 검사
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

module.exports = router;