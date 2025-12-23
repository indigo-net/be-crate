# CRATE Backend

지원서/설문지 양식 제공 + **평가/선발**까지 한 번에 처리하는 플랫폼
(Google Forms 대체 + 평가/권한/분배 중심)

---

## 📌 Overview

### Service

* **CRATE**

### Description

* 지원서·설문지 양식을 생성하고
* 응답 수집 이후 **평가 및 선발**까지 처리하는 백엔드 시스템

### Key Focus

* 평가 중심 구조
* 팀원 공유 및 문항 단위 권한
* 서버 강제 권한 검증
* 토큰 기반 외부 응답(public link)

---

## 🧱 Tech Stack

* **NestJS + TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **JWT (passport-jwt)**
* **Docker (Postgres, WSL 기반)**

---

## 🧩 Development Environment

### Local Setup Summary

* **OS**

  * Windows 10/11
  * WSL2 (Ubuntu)

* **Runtime**

  * Node.js (LTS)
  * NestJS

* **Database**

  * PostgreSQL (Docker, WSL)
  * docker-compose로 관리

* **ORM**

  * Prisma ORM
  * Prisma Client 자동 생성 사용

---

### ⚠️ Windows + WSL 환경 주의사항 (중요)

* PostgreSQL은 **WSL Docker**에서 실행
* NestJS 서버는 **Windows**에서 실행
* DB 접근 시 `localhost` 대신 **IPv4 고정 사용**

```env
DATABASE_URL=postgresql://crate:crate@127.0.0.1:5432/crate
```

> `localhost` 사용 시
> Windows → IPv6(`::1`) 우선 접근으로 인해
> Postgres 인증 실패(P1000) 발생 가능

---

## 🐘 PostgreSQL (Docker)

### docker-compose.yml (Postgres)

```yml
services:
  postgres:
    image: postgres:16
    container_name: crate-postgres
    environment:
      POSTGRES_USER: crate
      POSTGRES_PASSWORD: crate
      POSTGRES_DB: crate
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

* Postgres 단일 유저: `crate`
* 기본 `postgres` 유저는 생성되지 않음 (정상 동작)
* 계정 변경 시 반드시 `docker compose down -v` 필요

---

## 🧬 Prisma

### Current Schema

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password_hash String
  name          String?
  created_at    DateTime @default(now())
}
```

### Migration Status

* `init_user` migration 적용 완료
* Prisma Client 생성 완료
* DB ↔ schema 동기화 완료

---

## 🔐 Authentication (Auth)

### Implemented Features

* 회원가입 (Signup)
* 로그인 (Login)
* JWT 기반 인증
* 인증 확인 API (`/auth/me`)

### Auth Flow

1. **Signup**

   * 이메일 중복 체크
   * bcrypt 비밀번호 해시
   * users 테이블 저장

2. **Login**

   * 이메일 + 비밀번호 검증
   * JWT 발급 (`payload.sub = user.id`)

3. **Authenticated Request**

   * `Authorization: Bearer <token>`
   * JwtStrategy에서 user 조회
   * `req.user` 주입

---

## 📂 Project Structure

```txt
src
 ├─ app.module.ts

 ├─ common
 │   └─ prisma
 │       ├─ prisma.module.ts
 │       └─ prisma.service.ts

 ├─ users
 │   ├─ users.module.ts
 │   └─ users.service.ts

 ├─ auth
 │   ├─ auth.module.ts
 │   ├─ auth.controller.ts
 │   ├─ auth.service.ts
 │   ├─ guards
 │   │   └─ jwt-auth.guard.ts
 │   └─ strategies
 │       └─ jwt.strategy.ts

prisma
 └─ schema.prisma
```

### Architectural Notes

* 기능 기준(feature-based) 모듈 구조
* Prisma 사용 → entity 폴더 없음
* auth = 인증 로직 전용 (테이블 소유 ❌)
* users = 유저 데이터 접근 전용
* 권한 검증은 Guard + Strategy 기반

---

## ▶️ How to Run (Local)

### 1) PostgreSQL (WSL)

```bash
docker compose up -d
```

### 2) Prisma (WSL에서 실행 권장)

```bash
npx prisma generate
npx prisma migrate dev --name init_user
```

### 3) API Server (Windows)

```bash
npm run start:dev
```

---

## 🧪 API Test (Postman)

### Signup

```
POST /auth/signup
```

### Login

```
POST /auth/login
```

### Auth Check

```
GET /auth/me
Authorization: Bearer <accessToken>
```

---

## ✅ Current Progress

* ✅ 프로젝트 초기 세팅
* ✅ PostgreSQL (Docker + WSL) 연동
* ✅ Prisma 설정 및 migration
* ✅ Auth 도메인 구현

  * 회원가입 / 로그인
  * JWT 인증 파이프라인
* ✅ Windows ↔ WSL 환경 이슈 해결
* ✅ Postman 테스트 완료

---

## 🚧 Next Steps

### Form 도메인 시작

* forms 테이블 설계
* Form 생성 API
* `owner_id = req.user.id`

### 이후 확장 예정

* Question / Option
* 팀원 공유 (form_members)
* 문항 단위 권한
* Public link 기반 외부 응답
* Response / Answer 구조

---

## 🗺️ Roadmap

2. 인증(Auth) 기반 구축 ✅

3. Form / Question 도메인 ❎

- STORY 3-1. Form 관리

   * Task: Form 테이블/ERD 반영
   * Task: Form 생성 API
   * Task: Form 목록 조회 API
   * Task: Form 상세 조회 API
   * Task: Form 수정/삭제 API

- STORY 3-2. Question 관리

   * Task: Question / Option 테이블 설계
   * Task: 문항 생성 API
   * Task: 문항 조회 API
   * Task: 문항 수정 API
   * Task: 문항 삭제 API
   * Task: 문항 order_index 정렬 API

---

4. 팀원 공유 & 권한 시스템(핵심) ❎

- STORY 4-1. Form Member 관리

   * Task: form_members 테이블 구현
   * Task: 팀원 초대 API
   * Task: 팀원 목록 조회 API
   * Task: 팀원 role 변경 API
   * Task: 팀원 제거 API

- STORY 4-2. 문항 단위 권한

   * Task: form_member_question_permissions 테이블 구현
   * Task: 문항별 조회/수정 권한 저장 API
   * Task: 권한 체크 Service 구현
   * Task: 응답 조회 시 권한 필터링 로직 구현

---

5. Public Form (토큰 기반 응답) ❎

- STORY 5-1. Public Link 관리

   * Task: form_public_links 테이블 구현
   * Task: 토큰 생성 로직
   * Task: public link 생성 API
   * Task: public link 비활성화/만료 처리

- STORY 5-2. 외부 응답 플로우

   * Task: 토큰 기반 폼 조회 API (응답용)
   * Task: Response/Answer 저장 로직
   * Task: 외부 응답 제출 API
   * Task: rate limit 적용

---

6. Response 조회 & 관리 ❎

- STORY 6-1. 응답 저장 구조

   * Task: responses / answers 테이블 구현
   * Task: 응답 저장 트랜잭션 처리

- STORY 6-2. 응답 조회

   * Task: 응답 목록 조회 API (pagination)
   * Task: 응답 상세 조회 API
   * Task: 문항 권한 기반 답안 필터링

---

7. 운영/안정성 ❎

- STORY 7-1. 보안

   * Task: public token hash 저장
   * Task: 민감 데이터 로그 제거
   * Task: validation pipe 전역 적용

- STORY 7-2. 성능/확장 대비

   * Task: 주요 인덱스 설계
   * Task: Redis 도입 검토
   * Task: 대량 작업용 queue 구조 스캐폴딩

---

8. 개인 학습(NestJS 적응용) ❎

- STORY 8-1. Nest 기본

   * Task: Module/DI 구조 정리 문서화
   * Task: Controller-Service 책임 분리 연습

- STORY 8-2. 심화

   * Task: Guard / Interceptor 실습
   * Task: Prisma relation 쿼리 연습
   * Task: 권한 체크 공통화 리팩토링

---

## 📎 Notes

* Prisma migrate / generate는 **WSL에서 실행 권장**
* Postgres 계정 변경 시 볼륨 삭제 필수
* 인증/권한 검증은 항상 서버에서 강제







