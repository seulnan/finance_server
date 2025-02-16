const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/mongodb');


const app = express();

// Database 연결
connectDB();


// Middleware 설정
app.use(
  cors({
    origin: 'http://localhost:3000', // 허용할 클라이언트 URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // 허용할 HTTP 메서드
    credentials: true, // 쿠키, 인증 정보 허용 여부
  })
);
app.use(express.json()); // 최신 Express에서 body-parser 대체
app.use(bodyParser.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 라우트 설정
const routes = ['budget', 'transaction', 'pot', 'recurring', 'overview'];
routes.forEach((route) => {
  app.use(`/api/${route}`, require(`./routes/${route}Routes`));
});

app.get('/', (req, res) => {
  res.send('Family Budget API is running.');
});

module.exports = app;
