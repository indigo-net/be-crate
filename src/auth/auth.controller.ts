import {
    Controller,
    Post,
    Get,
    Body,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from '@/auth/auth.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

import { SignupDto } from '@/auth/dto/signup.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { KakaoLoginDto } from '@/auth/dto/kakao-login.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('kakao')
    kakaoLogin(@Body() dto: KakaoLoginDto) {
        return this.authService.kakaoLogin(dto.code);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req) {
        return req.user;
    }
}
