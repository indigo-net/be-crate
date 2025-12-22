import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    UsersModule,
  ],
})
export class AppModule { }

// 이 파일이 “하나의 기능 묶음”이라는 표시
// 1. imports: 다른 모듈 가져오기
// 2. controllers: HTTP 요청 받는 애들
// 3. providers: 비즈니스 로직, 주입 대상

// Nest 특징
// 1. 전부 클래스 + DI
// import { Module } from '@nestjs/...';   Nest 내부에서 제공하는 데코레이터 가져오는 것