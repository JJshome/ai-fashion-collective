# AI Fashion Collective - 구현 노트

이 문서는 인공지능을 이용한 패션플랫폼(특허 출원번호: 10-2022-0151706, 공개번호: 10-2024-0070763)의 구현 내용을 설명합니다.

## 구현된 특허 구성요소

### 1. 디자인 제안부(Design Proposal Component)
- 여러 사용자들에게 의류 디자인을 제안하고 표시하는 기능
- `HomePage.jsx` 및 `DesignEvaluationPage.jsx`에서 디자인 목록 표시
- 실시간으로 업데이트되는 디자인 정보를 사용자에게 제공

### 2. 평가 입력부(Evaluation Input Component)
- 사용자들이 디자인을 평가하고 수정할 수 있는 인터페이스
- `DesignEvaluationPage.jsx`에서 평가 및 피드백 입력 기능
- 다음 AI 도구 컴포넌트들을 포함:
  - `ObjectDetector.jsx`: 이미지에서 의류 오브젝트를 감지하는 기능
  - `TextureRenderer.jsx`: 선택된 오브젝트에 텍스처를 적용하는 기능
  - `ModelApplication.jsx`: 3D 모델/아바타에 의류를 적용하는 기능
  - `PatternExtractor.jsx`: 패턴을 자동으로 추출하는 기능

### 3. 인공지능 디자인 완성부(AI Design Completion Component)
- 사용자들의 평가를 반영하여 디자인을 완성하는 인공지능 기능
- `aiTools.js` 라우트에서 AI 업데이트 API 제공
- `DesignStudioPage.jsx`에서 단계적 디자인 완성 과정 구현

### 4. 디자인 개시부(Design Display Component)
- 완성된 디자인을 사용자별로 제공하는 기능
- `DashboardPage.jsx`에서 사용자의 디자인 목록과 상태 표시
- 디자인 완성도와 통계 정보 시각화

## 핵심 기술 컴포넌트

### 프론트엔드
1. **주요 페이지**
   - `HomePage.jsx`: 플랫폼 소개 및 주요 기능 소개
   - `DesignStudioPage.jsx`: 디자인 생성 및 편집 스튜디오
   - `DesignEvaluationPage.jsx`: 디자인 평가 및 피드백 시스템
   - `DashboardPage.jsx`: 사용자 디자인 및 활동 관리

2. **AI 도구 컴포넌트**
   - `ObjectDetector.jsx`: 의류 오브젝트 감지 도구
   - `TextureRenderer.jsx`: 텍스처 렌더링 도구
   - `ModelApplication.jsx`: 3D 모델 적용 도구
   - `PatternExtractor.jsx`: 패턴 추출 도구

3. **레이아웃 컴포넌트**
   - `Header.jsx`: 네비게이션 및 사용자 메뉴
   - `Footer.jsx`: 정보 및 링크

### 백엔드
1. **서버 구성**
   - `server.js`: Express 서버 설정 및 라우트 연결

2. **API 라우트**
   - `aiTools.js`: AI 기능 관련 API 엔드포인트

### AI 모듈
1. **객체 감지**
   - `model.py`: 의류 아이템 감지 및 세그멘테이션 AI 모델

## 기술 스택

- **프론트엔드**: React, Material-UI, Three.js
- **백엔드**: Node.js, Express, MongoDB
- **AI/ML**: TensorFlow, PyTorch, OpenCV
- **데이터베이스**: MongoDB
- **기타**: Web3.js (NFT 및 블록체인 기능)

## 미구현 기능 및 향후 개발 계획

1. **사용자 인증 시스템**
   - 회원가입 및 로그인 기능 완성
   - 사용자 프로필 관리

2. **블록체인 및 NFT 통합**
   - NFT 생성 및 관리 시스템
   - 블록체인 기반 사용자 참여 보상 시스템

3. **실시간 협업 기능**
   - Socket.io를 활용한 실시간 디자인 업데이트
   - 실시간 채팅 및 피드백 시스템

4. **AI 모델 고도화**
   - 실제 ML 모델 구현 및 통합
   - 모델 학습 파이프라인 개발

## 배포 안내

1. **개발 환경 설정**
   ```bash
   # 저장소 클론
   git clone https://github.com/JJshome/ai-fashion-collective.git
   cd ai-fashion-collective
   
   # 의존성 설치
   npm run install-all  # 프론트엔드 및 백엔드 의존성 모두 설치
   
   # AI 모듈 설정 (Python 환경)
   cd ai
   pip install -r requirements.txt
   ```

2. **개발 서버 실행**
   ```bash
   # 루트 디렉토리에서
   npm run dev  # 프론트엔드 및 백엔드 동시 실행
   ```

## 기여 방법

이 프로젝트는 특허 출원 중인 기술을 기반으로 하며, 기여는 라이선스 조건에 따라 제한될 수 있습니다.
기여하려면 먼저 라이선스 파일을 검토하고 출원인의 허가를 받으시기 바랍니다.

## 라이선스

이 프로젝트는 특허 출원 중인 기술을 기반으로 하며, 모든 권리는 출원인에게 있습니다.
자세한 내용은 LICENSE 파일을 참조하세요.