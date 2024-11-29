require('dotenv').config(); // .env 파일의 경로 명시
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose');
const connectDB = require('../config/mongodb'); // mongodb.js 불러오기
const Transaction = require('../models/Transaction'); // Transaction 스키마
const data = require('../../data.json'); // data.json 파일

console.log('MongoDB URI:', process.env.MONGO_URI);
// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// AWS S3 클라이언트 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// S3로 파일 업로드 함수
const uploadToS3 = async (filePath, key) => {
  if (!fs.existsSync(filePath)) return null; // 파일 존재 여부 확인

  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg', // MIME 타입 설정
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command); // S3 업로드 명령 실행
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (err) {
    console.error('S3 Upload Error:', err);
    return null;
  }
};

const processAndUploadData = async () => {
  const avatarDir = path.join(__dirname, '../../avatars');
  const avatarFiles = fs.readdirSync(avatarDir); // avatars 폴더 내 파일 목록 읽기

  for (const transaction of data.transactions) {
    try {
      const avatarFileName = path.basename(transaction.avatar); // "emma-richardson.jpg" 추출

      // 파일 목록에서 존재 여부 확인
      if (!avatarFiles.includes(avatarFileName)) {
        console.warn(
          `Avatar file not found in avatars folder: ${transaction.name}`
        );
        continue; // 파일이 없으면 건너뜀
      }

      const filePath = path.join(avatarDir, avatarFileName);
      const s3Key = `avatars/${Date.now()}_${avatarFileName}`;
      const avatarUrl = await uploadToS3(filePath, s3Key);

      if (!avatarUrl) {
        console.error(`Failed to upload avatar for ${transaction.name}`);
        continue; // S3 업로드 실패 시 다음 데이터로 넘어감
      }

      const newTransaction = new Transaction({
        avatar: avatarUrl,
        name: transaction.name,
        category: transaction.category,
        date: transaction.date,
        amount: transaction.amount,
        recurring: transaction.recurring,
      });

      await newTransaction.save();
      console.log(`Uploaded and saved transaction for: ${transaction.name}`);
    } catch (error) {
      console.error(
        `Failed to process transaction for ${transaction.name}:`,
        error.message
      );
    }
  }
};

processAndUploadData();
