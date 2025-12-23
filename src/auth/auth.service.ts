import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    // 회원가입
    async signup(params: {
        email: string;
        password: string;
        name?: string;
    }): Promise<User> {
        const { email, password, name } = params;

        // 이메일 중복 체크
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('이미 존재하는 이메일');
        }

        // 비밀번호 해시
        const passwordHash = await bcrypt.hash(password, 10);

        // 유저 생성
        return this.usersService.create({
            email,
            passwordHash,
            name,
        });
    }

    // 로그인
    async login(params: {
        email: string;
        password: string;
    }): Promise<{ accessToken: string }> {
        const { email, password } = params;

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('이메일 또는 비밀번호 오류');
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('이메일 또는 비밀번호 오류');
        }

        // JWT payload 최소화
        const payload = { sub: user.id };

        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}
