import { Injectable } from '@nestjs/common'; // Nest 내부에서 제공하는 데코레이터 가져오는 것

@Injectable()
export class UsersService { } // ES Module 문법

// @Injectable() :
// 1. loC 컨테이너(의존성 주입 컨테이너)에 등록.
// 2. 이 클래스는 다른 클래스에서 의존성으로 주입될 수 있음.
// 3. 기본적으로 싱글톤 관리. (전체 동일 인스턴스 공유)