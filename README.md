# 📦 CRATE Backend (Dev README)

> **개발 진행용 README**
> 실무 기준 구조/흐름 정리 문서이며, 포트폴리오용이 아님

---

## 1. 프로젝트 개요

* 서비스명: **CRATE**
* 성격: **지원서 · 설문 폼 + 평가/선발 플랫폼**
* 포지션: Google Forms 대체 + 평가/권한/분배 중심

### 핵심 컨셉

* Form → Question → Option → Response → Evaluation
* 모든 권한 검증은 **서버에서 강제**
* MVP → 확장 전제 구조

---

## 2. 기술 스택

* Framework: **NestJS (TypeScript)**
* DB: **PostgreSQL**
* ORM: **Prisma**
* Auth: **JWT + RefreshToken + httpOnly Cookie**
* Infra: 로컬 개발 기준

---

## 3. 아키텍처 원칙

### 3.1 모듈 구조

* 도메인 기준 모듈 분리
* Controller / Service / Repository(Prisma) 분리

### 3.2 설계 기준

* CRUD보다 **데이터 흐름 우선**
* Controller는 요청 분해만 담당
* 비즈니스 로직 · 권한 검증은 **Service 레벨**
* 순서 변경, 일괄 처리 → **트랜잭션 필수**

---

## 4. 현재 구현 상태 (2025-12 기준)

### ✅ Auth 도메인 (3차 완료)

#### 기능

* LOCAL 로그인 (email + password)
* KAKAO OAuth 로그인
* access / refresh 토큰 분리
* refresh token DB 저장 (해시)
* refresh token rotation
* httpOnly 쿠키 기반 인증
* 쿠키 기반 JwtStrategy

#### 엔드포인트

* `POST /auth/signup`
* `POST /auth/login`
* `POST /auth/kakao`
* `POST /auth/refresh`
* `POST /auth/logout`
* `GET /auth/me`

#### 인증 흐름 요약

* 로그인 성공 시 access/refresh 토큰을 **httpOnly 쿠키로 발급**
* access 만료 시 `/auth/refresh` 호출 → 자동 재발급
* 로그아웃 시 refresh 폐기 + 쿠키 삭제

---

### ✅ Users / Forms / Questions / QuestionOption

* 기본 CRUD 구현 완료
* Question 순서(order_index) 관리 포함

---

## 5. 아직 하지 않은 것 (의도적 보류)

* 통계 / 집계
* 평가 점수 계산
* 캐싱 / 성능 최적화
* 복잡한 권한 계층
* 프론트 편의용 API

---

## 6. 다음 작업 우선순위

1. **Response 도메인**

   * 응답 생성 흐름
   * 외부 접근(public link) 기준 정의

2. **Public Link**

   * 토큰 기반 외부 접근

3. **Permission / Evaluation**

   * 평가자 권한 모델
   * 평가 대상 범위 제어

---

## 7. 개발 규칙 요약

* 추측 금지, 항상 DB 기준 설명
* 필요 없는 컬럼/엔드포인트는 보류
* 구조 → 흐름 → 코드 순서 고정

---

⚠️ 이 문서는 **개발 진행에 따라 계속 갱신됨**
