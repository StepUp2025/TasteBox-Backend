# Tastebox Backend

## 📚 프로젝트 개요

Tastebox Backend는 NestJS 기반의 백엔드 서버로, 인증, 사용자 관리, 영화/TV 정보 제공 등의 API를 제공합니다.

## ✨ 주요 기능

- 사용자 인증 및 소셜 로그인(Google, Kakao)
- 영화/TV 정보 제공 API
- JWT/Refresh Token 기반 인증
- Redis를 활용한 세션/토큰 관리
- Swagger(OpenAPI) 기반 API 문서 제공
- 코드 포맷팅/린팅 자동화 및 커밋 컨벤션 강제

## 🛠️ 기술 스택

- **Node.js, NestJS, TypeScript**
- **MySQL, Redis**
- **JWT, OAuth2 (Google, Kakao)**

## 🧰 개발 도구 / 코드 품질 관리

- **Biome, Prettier, Husky, lint-staged, commitlint**

## ⚙️ 환경변수 설정 안내

`.env` 파일은 **절대 깃허브에 올리지 마세요**.  
아래 예시를 참고해 `.env.example` 파일을 복사하여 `.env`로 사용하고,  
각 항목에 실제 값을 입력하세요.

### .env.example

```text
# MySQL 환경변수
MYSQL_DATABASE=
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_SYNCHRONIZE=

# Redis 환경변수
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_REFRESH_EXPIRE_SECONDS=

# Google API
GOOGLE_API_KEY=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=

# Refresh JWT
REFRESH_JWT_SECRET=
REFRESH_JWT_EXPIRES_IN=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_SECRET=
GOOGLE_CALLBACK_URL=

# Kakao OAuth
KAKAO_CLIENT_ID=
KAKAO_CALLBACK_URL=
```

### 환경변수 설명

| 변수명                       | 설명                             | 예시값/비고                                |
| ---------------------------- | -------------------------------- | ------------------------------------------ |
| MYSQL_DATABASE               | MySQL 데이터베이스 이름          | tastebox                                   |
| MYSQL_HOST                   | MySQL 호스트 주소                | 127.0.0.1                                  |
| MYSQL_PORT                   | MySQL 포트 번호                  | 3306                                       |
| MYSQL_USERNAME               | MySQL 사용자명                   | root                                       |
| MYSQL_PASSWORD               | MySQL 비밀번호                   |                                            |
| MYSQL_SYNCHRONIZE            | TypeORM 동기화 여부 (true/false) | true                                       |
| REDIS_HOST                   | Redis 호스트 주소                | 127.0.0.1                                  |
| REDIS_PORT                   | Redis 포트 번호                  | 6379                                       |
| REDIS_PASSWORD               | Redis 비밀번호                   |                                            |
| REDIS_REFRESH_EXPIRE_SECONDS | Redis 리프레시 토큰 만료(초)     | 86400 (1일)                                |
| GOOGLE_API_KEY               | Google API 키                    |                                            |
| JWT_SECRET                   | JWT 서명용 시크릿                |                                            |
| JWT_EXPIRES_IN               | JWT 만료 기간                    | 1d                                         |
| REFRESH_JWT_SECRET           | 리프레시 토큰용 시크릿           |                                            |
| REFRESH_JWT_EXPIRES_IN       | 리프레시 토큰 만료 기간          | 7d                                         |
| GOOGLE_CLIENT_ID             | 구글 OAuth Client ID             |                                            |
| GOOGLE_SECRET                | 구글 OAuth Secret                |                                            |
| GOOGLE_CALLBACK_URL          | 구글 OAuth 콜백 URL              | http://localhost:3000/auth/google/callback |
| KAKAO_CLIENT_ID              | 카카오 OAuth Client ID           |                                            |
| KAKAO_CALLBACK_URL           | 카카오 OAuth 콜백 URL            | http://localhost:3000/auth/kakao/callback  |

## 🚀 설치 및 실행

1. **레포지토리 클론**

   ```bash
     git clone https://github.com/StepUp2025/TasteBox-Backend.git

     cd tastebox-backend
   ```

2. **의존성 설치**
   ```bash
    npm install
   ```
3. **환경변수 파일 생성**

   - `.env.example`을 복사해 `.env`로 만들고, 실제 값을 입력하세요.

4. **DB/Redis 등 외부 서비스 준비**

5. **개발 서버 실행**
   ```bash
    npm run start:dev
   ```

## 🗂️ 폴더 구조

```text
  src/
  ├── auth/ # 인증/인가 관련 모듈
  ├── user/ # 사용자 관련 모듈
  ├── movie/ # 영화 정보 API
  ├── tv/ # TV 정보 API
  ├── common/ # 공통 유틸리티, 데코레이터 등
  ├── main.ts # 엔트리포인트
  └── ...
```

## 🧑‍💻 협업 및 개발 환경 가이드

- **코드 포맷팅/린팅**
  - `npm run format`으로 전체 코드 자동 정렬(기존 작업 중인 파일도 포함)
  - 마크다운 파일은 Prettier로, 나머지는 Biome으로 포맷팅
- **커밋 컨벤션**
  - 커밋 메시지는 팀 규칙을 따라 작성 (commitlint 자동 체크)
- **브랜치 네이밍**
  - `feat/`, `fix/`, `chore/` 등 prefix 사용
- **VSCode 확장**
  - Biome 확장 설치
  - `.vscode/settings.json` 참고
- **윈도우 사용자**
  - 줄바꿈 정책:
    ```bash
      git config --global core.autocrlf false
    ```
- **초기 설정 단계에서는 자동화 체크(CI/CD, git hook 등)로 에러/경고가 있어도 커밋/PR/머지가 가능**
- **코드 품질 경고가 모두 수정되면, 이후에는 CI/CD에서 에러/경고 발생 시 PR/머지가 차단될 예정**
