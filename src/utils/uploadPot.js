require('dotenv').config();
const mongoose = require('mongoose');
const Pot = require('../models/Pot'); // Pot 스키마 가져오기

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// 주어진 데이터
const potData = [
  {
    name: 'Savings',
    target: 200.00,
    currentAmount: 159.00,
    color: 'Red',
  },
  {
    name: 'Concert Ticket',
    target: 130.00,
    currentAmount: 110.00,
    color: 'Purple',
  },
  {
    name: 'Gift',
    target: 150.00,
    currentAmount: 10.00,
    color: 'Turquoise',
  },
  {
    name: 'New Laptop',
    target: 100.0,
    currentAmount: 10.00,
    color: 'Brown',
  },
  {
    name: 'Holiday',
    target: 144.00,
    currentAmount: 51.00,
    color: 'Blue',
  },
];

// 데이터 삽입 함수
const uploadPots = async () => {
  try {
    // MongoDB에 데이터 삽입
    await Pot.insertMany(potData);
    console.log('Pots inserted successfully:', potData);
  } catch (err) {
    console.error('Error inserting pots:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

uploadPots();
