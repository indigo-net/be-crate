# CRATE Backend

지원서/설문지 양식 제공 + **평가/선발**까지 한 번에 처리하는 플랫폼 (Google Forms 대체 + 평가/권한/분배 중심).

---

## 📌 Overview

### 서비스명
- **CRATE**

### 한 줄 소개
- 지원서·설문지 양식 제공 및 **종합 평가·선발** 플랫폼

### 타겟 사용자
- 대학 동아리/학회 운영진
- 스타트업 채용 담당자
- 행사/공모전 운영자
- 소규모 팀 선발 담당자

### 개발 배경
기존 양식 도구는 “수집”에 최적화되어 있으나, 실제 모집 프로세스의 핵심은 “평가/선발”이다.  
CRATE는 **수집 → 평가 → 선발**을 한 플랫폼에서 처리하도록 설계한다.

---

## 🎯 Core Value

1. **수집보다 선발에 집중**
   - 질문/항목 단위 평가(점수, 태그 등) 기반 UX
   - 선착순/추첨 등 다양한 선발 방식 지원(확장 예정)

2. **팀 협업을 위한 평가 시스템**
   - 평가 분배(자동/수동)와 권한 관리
   - 진행률 추적 및 공유(확장 예정)

3. **불필요한 기능 제거**
   - 복잡한 분석 도구 제외
   - 누구나 5분 내 이해 가능한 단순함 지향

---

## 🧱 Tech Stack

- **NestJS + TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- Local Dev DB: **Docker(Postgres)**

---

## 🏗️ Architecture

- 도메인 기준 모듈 구조
- Controller / Service / (Repository는 필요 시 도입)
- 권한 검증은 **서버에서 강제**
- 외부 응답은 **토큰 기반(public link)**

### Directory Structure (current)
```txt
src
 ├─ app.module.ts
 ├─ common
 │   ├─ guards
 │   ├─ interceptors
 │   ├─ filters
 │   ├─ decorators
 │   ├─ errors
 │   └─ types
 ├─ auth
 ├─ users
 ├─ forms
 ├─ questions
 ├─ permissions
 ├─ public-links
 └─ responses
````

---

## ✅ Current Progress

### EPIC 1. 개발 환경 & 프로젝트 초기 세팅 ✅

#### STORY 1-1. NestJS 프로젝트 초기화 ✅

* NestJS 프로젝트 생성 ✅
* 기본 디렉토리 구조 정리(module/controller/service) ✅
* eslint / prettier 설정 ✅
* env 분리(dev/local) ✅ *(현재는 `.env` 중심으로 통일하여 사용)*

#### STORY 1-2. DB/ORM 세팅 ✅(로컬 기준)

* PostgreSQL 클라우드 인스턴스 생성 ⏳ *(아직 진행 전)*
* Prisma 설치 및 초기화 ✅
* Prisma schema 기본 구조 작성 ✅
* 로컬 Docker로 postgres 연결 ✅
* Prisma migrate 성공 ✅ (`init_user`, User 모델)

---

## 🚀 Getting Started (Local)

### 1) Prerequisites

* Node.js (LTS 권장)
* Docker Engine (예: WSL2 Ubuntu에 Docker Engine 직접 설치) 또는 Docker Desktop
* PostgreSQL는 **로컬 설치 불필요** (Docker로 사용)

### 2) Environment

루트에 `.env` 준비:

```env
NODE_ENV=local
PORT=3000

DATABASE_URL=postgresql://crate:crate@localhost:5432/crate
JWT_SECRET=local-secret
```

### 3) Run PostgreSQL (Docker)

루트의 `docker-compose.yml` 사용:

```bash
docker compose up -d
docker ps
```

### 4) Install Dependencies

```bash
npm install
```

### 5) Prisma (migrate)

```bash
npx prisma migrate dev --name init_user
```

### 6) Start API Server

```bash
npm run start:dev
```

---

## 🧬 Prisma

* Schema: `prisma/schema.prisma`
* Migrations: `prisma/migrations/*`

### Prisma Studio (optional)

```bash
npx prisma studio
```

---

## 🗺️ Roadmap

## 🔐 EPIC 2. 인증(Auth) 기반 구축 ❎

### STORY 2-1. 사용자 모델 구현

* Task: users 테이블 설계 및 마이그레이션
* Task: User Model 정의 (확장)
* Task: 비밀번호 해시 처리

### STORY 2-2. 인증 API

* Task: 회원가입 API
* Task: 로그인 API
* Task: JWT 발급 로직
* Task: 인증 Guard 적용
* Task: `/me` API 구현

---

## 📝 EPIC 3. Form / Question 도메인 ❎

### STORY 3-1. Form 관리

* Task: Form 테이블/ERD 반영
* Task: Form 생성 API
* Task: Form 목록 조회 API
* Task: Form 상세 조회 API
* Task: Form 수정/삭제 API

### STORY 3-2. Question 관리

* Task: Question / Option 테이블 설계
* Task: 문항 생성 API
* Task: 문항 조회 API
* Task: 문항 수정 API
* Task: 문항 삭제 API
* Task: 문항 order_index 정렬 API

---

## 👥 EPIC 4. 팀원 공유 & 권한 시스템(핵심) ❎

### STORY 4-1. Form Member 관리

* Task: form_members 테이블 구현
* Task: 팀원 초대 API
* Task: 팀원 목록 조회 API
* Task: 팀원 role 변경 API
* Task: 팀원 제거 API

### STORY 4-2. 문항 단위 권한

* Task: form_member_question_permissions 테이블 구현
* Task: 문항별 조회/수정 권한 저장 API
* Task: 권한 체크 Service 구현
* Task: 응답 조회 시 권한 필터링 로직 구현

---

## 🌍 EPIC 5. Public Form (토큰 기반 응답) ❎

### STORY 5-1. Public Link 관리

* Task: form_public_links 테이블 구현
* Task: 토큰 생성 로직
* Task: public link 생성 API
* Task: public link 비활성화/만료 처리

### STORY 5-2. 외부 응답 플로우

* Task: 토큰 기반 폼 조회 API (응답용)
* Task: Response/Answer 저장 로직
* Task: 외부 응답 제출 API
* Task: rate limit 적용

---

## 📊 EPIC 6. Response 조회 & 관리 ❎

### STORY 6-1. 응답 저장 구조

* Task: responses / answers 테이블 구현
* Task: 응답 저장 트랜잭션 처리

### STORY 6-2. 응답 조회

* Task: 응답 목록 조회 API (pagination)
* Task: 응답 상세 조회 API
* Task: 문항 권한 기반 답안 필터링

---

## ⚙️ EPIC 7. 운영/안정성 ❎

### STORY 7-1. 보안

* Task: public token hash 저장
* Task: 민감 데이터 로그 제거
* Task: validation pipe 전역 적용

### STORY 7-2. 성능/확장 대비

* Task: 주요 인덱스 설계
* Task: Redis 도입 검토
* Task: 대량 작업용 queue 구조 스캐폴딩

---

## 📚 EPIC 8. 개인 학습(NestJS 적응용) ❎

### STORY 8-1. Nest 기본

* Task: Module/DI 구조 정리 문서화
* Task: Controller-Service 책임 분리 연습

### STORY 8-2. 심화

* Task: Guard / Interceptor 실습
* Task: Prisma relation 쿼리 연습
* Task: 권한 체크 공통화 리팩토링

---

## 📎 Notes

* 로컬 개발 DB는 Docker(Postgres) 사용을 기본으로 한다.
* 클라우드 Postgres(dev/prod)는 `DATABASE_URL`만 분리하여 동일한 코드로 운영한다.
* 권한 검증은 서버에서 강제하며, 외부 응답은 토큰 기반으로 접근을 제한한다.

---


