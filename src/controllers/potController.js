const Pot = require('../models/Pot');
const { COLORS } = require('../config/constants');

const getAvailableColors = async (req, res) => {
  try {
    // 이미 사용된 색상 가져오기
    const pots = await Pot.find({});
    const usedColors = pots.map((pot) => pot.color);

    // 사용 가능한 색상 계산
    const availableColors = COLORS.filter(
      (color) => !usedColors.includes(color)
    );

    res.status(200).json({
      usedColors,
      availableColors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAvailableColors };
