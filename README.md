# 📦 CRATE Backend (Dev README)

지원서/설문지 양식 제공 + **평가/선발**까지 한 번에 처리하는 플랫폼
(Google Forms 대체 + 평가/권한/분배 중심)

---

## 1. 프로젝트 개요 (개발 관점)

- 서비스명: **CRATE**
- 성격: 평가·선발 중심 폼 관리 시스템
- 핵심 컨셉:
  - Form → Question → (Option) → Response → Evaluation
  - 권한은 서버에서 강제
  - MVP 우선, 확장 가능 구조 유지

---

## 2. 기술 스택

- **NestJS + TypeScript**
- **PostgreSQL**
  - 로컬: Docker
  - 운영: Managed DB 예정
- **Prisma ORM**
- **JWT (passport-jwt)**
- **Swagger** (개발 중 테스트용)

---

## 3. 현재 디렉토리 구조

```txt
src/
 ├─ auth            # 인증 (완료)
 ├─ users           # 사용자 (완료)
 ├─ forms           # 폼 (완료)
 ├─ questions       # 질문 (완료)
 ├─ public-links    # 외부 응답 링크 (미구현)
 ├─ responses       # 응답 데이터 (미구현)
 ├─ permissions     # 권한/역할 (미구현)
 ├─ common
 │   ├─ prisma
 │   └─ guards
 └─ app.module.ts
````

> Prisma 사용 → Entity 레이어 없음
> 도메인 기준 모듈 구조 유지 중

---

## 4. 구현 완료 상태 요약 (중요)

### ✅ Auth

* 회원가입 / 로그인
* JWT 발급
* `GET /auth/me`
* JwtStrategy + JwtAuthGuard 정상 동작
* Swagger BearerAuth 연동 완료

### ✅ Users

* 사용자 조회 (email / id)
* Auth에서만 사용
* 별도 공개 API 없음

### ✅ Forms

* Form 생성
* Form 목록 조회 (owner 기준)
* Form 단건 조회
* Form 수정
* Form 삭제 (soft delete)
* 모든 접근은 `owner_id = req.user.id` 기준

### ✅ Questions

* Question 생성
* Question 목록 조회 (order_index ASC)
* Question 수정
* Question 삭제

  * 삭제 시 뒤 질문들의 order_index 자동 당김
* Question 순서 변경 API

  * drag & drop 대응
  * 트랜잭션 기반
* QuestionType enum 사용

> **Question 도메인 1차 완료 상태**

---

## 5. 주요 API 구조 정리

### Auth

```txt
POST   /auth/signup
POST   /auth/login
GET    /auth/me        (JWT)
```

### Forms

```txt
POST   /forms
GET    /forms
GET    /forms/:id
PATCH  /forms/:id
DELETE /forms/:id      (soft delete)
```

### Questions

```txt
POST   /forms/:formId/questions
GET    /forms/:formId/questions
PATCH  /forms/:formId/questions/:id
DELETE /forms/:formId/questions/:id
PATCH  /forms/:formId/questions/reorder
```

---

## 6. Question 순서 변경 API 메모

```
PATCH /forms/:formId/questions/reorder
```

Body:

```json
{
  "questionIds": [
    "question-id-1",
    "question-id-2",
    "question-id-3"
  ]
}
```

* 배열 순서 = 최종 order_index
* 서버에서 0부터 재할당
* `$transaction` 사용

---

## 7. Prisma / DB 관련 메모

### 로컬 개발

* PostgreSQL은 Docker 컨테이너
* Prisma migrate 사용

```bash
npx prisma migrate dev
npx prisma generate
```

### 주의사항

* `docker compose down -v` 실행 시 **데이터 전부 삭제**
* Docker 컨테이너 내려도 **볼륨 유지하면 데이터 유지**
* Prisma schema 변경은 항상 migrate 필요

---

## 8. 서버 실행

### 개발 모드 (권장)

```bash
npm run start:dev
```

* 코드 변경 시 자동 반영
* Swagger 데코레이터 변경 시 가끔 재시작 필요

### Swagger

* `http://localhost:3000/api-docs`
* 인증 필요한 API는 **Authorize 버튼 필수**

---

## 9. 전역 설정 메모

* ValidationPipe 전역 적용

  * whitelist: true
  * forbidNonWhitelisted: true
* DTO 없는 요청은 바로 400
* Swagger 파라미터는 `@ApiParam` 명시 필요

---

## 10. 아직 구현 안 한 도메인 (다음 작업 후보)

### ⏳ public-links

* 토큰 기반 외부 응답 링크
* 인증 없이 접근
* 서버에서 권한 강제

### ⏳ responses

* 지원서 응답 데이터 저장
* Question + Option 구조 의존
* 이후 Evaluation과 연결 예정

### ⏳ permissions

* Form 멤버
* 역할 기반 접근 제어
* Question 단위 권한 분리

---

⚠️ 이 문서는 개발 진행에 따라 계속 수정될 전제임.

```









