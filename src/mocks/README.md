# MSW (Mock Service Worker) 설정 가이드

## 📦 설치

```bash
pnpm add -D msw@latest
```

## 🚀 Service Worker 초기화

public 폴더에 MSW service worker 파일을 생성해야 합니다:

```bash
npx msw init public/ --save
```

## 🔧 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하세요:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8080

# Enable MSW mocking (automatically enabled in dev mode)
VITE_ENABLE_MOCKS=false
```

개발 환경에서는 자동으로 MSW가 활성화됩니다.

## 📝 API 엔드포인트

### Auth API

1. **POST /auth/login**
   - Request: `{ username: string, password: string }`
   - Response: `{ accessToken: string, username: string, role: string }`

2. **POST /auth/logout**
   - Request: 없음
   - Response: 204 No Content

3. **POST /auth/join**
   - Request: `{ username: string, password: string, nickname: string, email: string }`
   - Response: `{ id: number, username: string, nickname: string, email: string, profileImgPath: string | null, role: string }`

### Todo API

1. **GET /todo/me**
   - Headers: `Authorization: Bearer {token}`
   - Response: `Todo[]`

2. **POST /todo**
   - Headers: `Authorization: Bearer {token}`
   - Request: `{ title: string, description: string, deadline: Date, parentId: number | null }`
   - Response: `Todo[]`

## 🧪 테스트 계정

초기 데이터에는 다음 테스트 계정이 포함되어 있습니다:

### 일반 사용자

- Username: `testuser`
- Password: `password123`

### 관리자

- Username: `admin`
- Password: `admin123`

## 📁 구조

```
src/mocks/
├── schema/           # API 타입 정의
│   ├── auth.ts
│   ├── todo.ts
│   └── index.ts
├── data/            # 초기 데이터
│   └── init-data.ts
├── db/              # 런타임 메모리 DB
│   ├── db.ts
│   ├── persist.ts   # localStorage 저장/복구 (선택)
│   └── utils.ts
├── handlers/        # API 핸들러
│   ├── auth.ts
│   ├── todo.ts
│   └── index.ts
├── browser.ts       # 브라우저용 MSW worker
├── server.ts        # Node.js용 MSW server
└── index.ts         # enableMocks()
```

## 💡 사용법

MSW는 `main.tsx`에서 자동으로 초기화됩니다:

```typescript
import { enableMocks } from './mocks'

enableMocks().then(() => {
  // 앱 렌더링
})
```

개발 모드에서는 콘솔에 "🔷 MSW worker started" 메시지가 표시됩니다.

## 🔄 데이터 초기화

브라우저 콘솔에서 다음 명령으로 데이터를 재초기화할 수 있습니다:

```javascript
import { db } from '@/mocks'
import { initializeData } from '@/mocks/data/init-data'

initializeData()
```

## 🛠️ 디버깅

MSW는 모든 요청을 가로채고 콘솔에 로그를 출력합니다. 네트워크 탭에서 요청을 확인할 수 있지만, 실제로는 서버로 전송되지 않고 MSW에서 처리됩니다.
