import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController { }

// HTTP 요청 입구
// 'users'는 URL prefix
// GET /users 이런 게 여기로 들어온다.