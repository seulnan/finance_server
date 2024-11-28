require('dotenv').config(); // .env 파일 로드
const app = require('./src/app'); // Express 앱 가져오기

const PORT = process.env.PORT || 5002;

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
