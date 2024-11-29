require('dotenv').config();
const mongoose = require('mongoose');
const Budget = require('../models/Budget'); // Budget 스키마 가져오기

console.log('MongoDB URI:', process.env.MONGO_URI);
// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 이미 변환된 데이터
const budgets = [
  {
    name: 'Entertainment',
    color: 'Green',
    limit: 50,
    used: 12.34,
  },
  {
    name: 'Bills',
    color: 'Yellow',
    limit: 750,
    used: 234.56,
  },
  {
    name: 'Dining Out',
    color: 'Cyan',
    limit: 75,
    used: 50.23,
  },
  {
    name: 'Personal Care',
    color: 'Navy',
    limit: 100,
    used: 85.12,
  },
];

// 데이터 삽입 함수
const insertBudgets = async () => {
  try {
    // 데이터 삽입
    await Budget.insertMany(budgets);
    console.log('Budgets inserted successfully:', budgets);
  } catch (err) {
    console.error('Error inserting budgets:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

insertBudgets();
