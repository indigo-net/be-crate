import {
    Controller,
    Post,
    Get,
    Body,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

import { SignupDto } from '@/auth/dto/signup.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { KakaoLoginDto } from '@/auth/dto/kakao-login.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    /* =====================
     * 회원가입
     * ===================== */
    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    /* =====================
     * LOCAL 로그인
     * ===================== */
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } =
            await this.authService.login(dto);

        this.setAuthCookies(res, accessToken, refreshToken);

        return { ok: true };
    }

    /* =====================
     * KAKAO 로그인
     * ===================== */
    @Post('kakao')
    async kakaoLogin(
        @Body() dto: KakaoLoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } =
            await this.authService.kakaoLogin(dto.code);

        this.setAuthCookies(res, accessToken, refreshToken);

        return { ok: true };
    }

    /* =====================
     * 토큰 재발급
     * ===================== */
    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;

        const { accessToken, refreshToken: nextRefreshToken } =
            await this.authService.refresh({ refreshToken });

        this.setAuthCookies(res, accessToken, nextRefreshToken);

        return { ok: true };
    }

    /* =====================
     * 로그아웃
     * ===================== */
    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;

        await this.authService.logout(refreshToken);

        // 쿠키 삭제
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/auth/refresh' });

        return { ok: true };
    }


    /* =====================
     * 내 정보
     * ===================== */
    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req: any) {
        return req.user;
    }

    /* =====================
     * 쿠키 세팅 헬퍼
     * ===================== */
    private setAuthCookies(
        res: Response,
        accessToken: string,
        refreshToken: string,
    ) {
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // prod에서는 true
            path: '/',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // prod에서는 true
            path: '/auth/refresh',
        });
    }
}
