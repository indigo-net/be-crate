import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@/app.module';

async function bootstrap() {
  // Nest 애플리케이션 생성
  const app = await NestFactory.create(AppModule);

  // ✅ 전역 ValidationPipe
  // - whitelist: DTO에 정의되지 않은 필드 제거
  // - forbidNonWhitelisted: DTO에 없는 필드 오면 400 에러
  // - transform: 요청 payload를 DTO 타입으로 변환
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger 문서 기본 설정
  const config = new DocumentBuilder()
    .setTitle('CRATE API') // 문서 제목
    .setDescription('CRATE Backend API') // 설명
    .setVersion('1.0') // 버전
    .addBearerAuth() // Authorization: Bearer 토큰 사용
    .build();

  // Swagger 문서 생성
  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI 경로 (/api-docs)
  SwaggerModule.setup('api-docs', app, document);

  // 서버 실행 (포트 3000)
  await app.listen(3000);
}

bootstrap();
