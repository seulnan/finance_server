const Budget = require('../models/Budget');
const { CATEGORIES, COLORS } = require('../config/constants');

const getAvailableOptions = async (req, res) => {
  try {
    // 이미 사용된 카테고리와 색상 가져오기
    const budgets = await Budget.find({});
    const usedCategories = budgets.map((budget) => budget.name);
    const usedColors = budgets.map((budget) => budget.color);

    // 사용 가능한 카테고리와 색상 계산
    const availableCategories = CATEGORIES.filter(
      (category) => !usedCategories.includes(category)
    );
    const availableColors = COLORS.filter(
      (color) => !usedColors.includes(color)
    );

    res.status(200).json({
      usedCategories,
      availableCategories,
      usedColors,
      availableColors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAvailableOptions };
