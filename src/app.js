const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/mongodb');

const app = express();

// Database 연결
connectDB();

// Middleware 설정
app.use(cors());
app.use(bodyParser.json());

// // 라우트 설정
// app.use('/api/budgets', require('./routes/budgetRoutes'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));
// app.use('/api/pots', require('./routes/potRoutes'));
// app.use('/api/recurrings', require('./routes/recurringRoutes'));


// 기본 라우트
app.get('/', (req, res) => {
  res.send('Family Budget API is running.');
});

module.exports = app;