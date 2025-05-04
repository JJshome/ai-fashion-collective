/**
 * AI Fashion Collective 백엔드 서버
 * 
 * 이 서버는 AI 패션 플랫폼을 위한 API 엔드포인트를 제공합니다.
 * 특허 기술 '인공지능을 이용한 패션플랫폼'(출원번호: 10-2022-0151706)을 구현합니다.
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

// 환경 변수 로드
dotenv.config();

// 앱 초기화
const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (프로덕션 환경에서 프론트엔드 빌드 파일 서빙)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// MongoDB 연결 (실제 배포 시 환경 변수로 관리)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-fashion-collective', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB에 성공적으로 연결되었습니다.');
})
.catch((err) => {
  console.error('MongoDB 연결 오류:', err);
});

// 라우트 설정
// 사용자 인증 관련 라우트
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 디자인 관련 라우트
const designRoutes = require('./routes/designs');
app.use('/api/designs', designRoutes);

// 평가 관련 라우트
const evaluationRoutes = require('./routes/evaluations');
app.use('/api/evaluations', evaluationRoutes);

// AI 도구 관련 라우트
const aiToolsRoutes = require('./routes/aiTools');
app.use('/api/ai-tools', aiToolsRoutes);

// 기본 라우트
app.get('/api', (req, res) => {
  res.json({ message: 'AI Fashion Collective API에 오신 것을 환영합니다!' });
});

// 프로덕션 환경에서 모든 요청을 React 앱으로 리다이렉트
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

module.exports = app;