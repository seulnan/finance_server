const express = require('express');
const router = express.Router();
const { getAvailableOptions } = require('../controllers/budgetController');

// 사용 가능한 옵션 가져오기
router.get('/available-options', getAvailableOptions);

module.exports = router;
