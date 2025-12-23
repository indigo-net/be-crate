import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // 회원가입
    @Post('signup')
    signup(
        @Body() body: { email: string; password: string; name?: string },
    ) {
        return this.authService.signup(body);
    }

    // 로그인
    @Post('login')
    login(
        @Body() body: { email: string; password: string },
    ) {
        return this.authService.login(body);
    }

    // 내 정보 조회 (JWT 인증 필요)
    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req) {
        return req.user;
    }
}
