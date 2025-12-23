import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(
        // Prisma를 통해 users 테이블 접근
        private readonly prisma: PrismaService,
    ) { }

    // 이메일로 유저 단건 조회 (로그인, 중복 체크용)
    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    // ID로 유저 조회 (JWT 인증 후 사용자 식별용)
    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    // 유저 생성 (회원가입)
    // 비밀번호는 반드시 hash 된 값만 받는다
    async create(params: {
        email: string;
        passwordHash: string;
        name?: string;
    }): Promise<User> {
        const { email, passwordHash, name } = params;

        return this.prisma.user.create({
            data: {
                email,
                password_hash: passwordHash,
                name,
            },
        });
    }
}
