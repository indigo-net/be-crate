import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@/users/users.service';
import { AuthProvider, User } from '@prisma/client';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly http: HttpService,
    ) { }

    /* =====================
     * LOCAL 회원가입
     * ===================== */
    async signup(params: {
        email: string;
        password: string;
        name?: string;
    }): Promise<User> {
        const { email, password, name } = params;

        const exists =
            await this.usersService.findLocalByEmail(email);
        if (exists) {
            throw new ConflictException('이미 존재하는 이메일');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        return this.usersService.createLocalUser({
            email,
            passwordHash,
            name,
        });
    }

    /* =====================
     * LOCAL 로그인
     * ===================== */
    async login(params: {
        email: string;
        password: string;
    }): Promise<{ accessToken: string }> {
        const { email, password } = params;

        const user =
            await this.usersService.findLocalByEmail(email);

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('이메일 또는 비밀번호 오류');
        }

        const isValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        if (!isValid) {
            throw new UnauthorizedException('이메일 또는 비밀번호 오류');
        }

        return this.issueToken(user.id);
    }

    /* =====================
     * KAKAO 로그인
     * ===================== */
    async kakaoLogin(code: string): Promise<{ accessToken: string }> {
        // 1. 카카오 토큰 요청
        const tokenRes = await firstValueFrom(
            this.http.post(
                'https://kauth.kakao.com/oauth/token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_REST_API_KEY!,
                    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
                    code,
                    client_secret: process.env.KAKAO_CLIENT_SECRET!,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            ),
        );

        const kakaoAccessToken = tokenRes.data.access_token;
        if (!kakaoAccessToken) {
            throw new UnauthorizedException('카카오 토큰 발급 실패');
        }

        // 2. 카카오 유저 정보 조회
        const userRes = await firstValueFrom(
            this.http.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${kakaoAccessToken}`,
                },
            }),
        );

        const kakaoId = String(userRes.data.id);
        const email = userRes.data.kakao_account?.email;
        const name =
            userRes.data.kakao_account?.profile?.nickname;

        // 3. 유저 조회 / 생성
        let user =
            await this.usersService.findByProvider(
                AuthProvider.KAKAO,
                kakaoId,
            );

        if (!user) {
            user = await this.usersService.createOAuthUser({
                provider: AuthProvider.KAKAO,
                providerId: kakaoId,
                email,
                name,
            });
        }

        // 4. JWT 발급
        return this.issueToken(user.id);
    }

    /* =====================
     * JWT 발급 공통
     * ===================== */
    private issueToken(userId: string): { accessToken: string } {
        const payload = { sub: userId };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
