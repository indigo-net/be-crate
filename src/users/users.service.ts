import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AuthProvider, User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // LOCAL 전용 (이메일 로그인)
    async findLocalByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                email,
                provider: AuthProvider.LOCAL,
            },
        });
    }

    // OAuth 전용 (provider + providerId)
    async findByProvider(
        provider: AuthProvider,
        providerId: string,
    ): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                provider_providerId: {
                    provider,
                    providerId,
                },
            },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    // LOCAL 회원가입
    async createLocalUser(params: {
        email: string;
        passwordHash: string;
        name?: string;
    }): Promise<User> {
        const { email, passwordHash, name } = params;

        return this.prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                provider: AuthProvider.LOCAL,
            },
        });
    }

    // OAuth 유저 생성 (KAKAO / GOOGLE)
    async createOAuthUser(params: {
        provider: AuthProvider;
        providerId: string;
        email?: string;
        name?: string;
    }): Promise<User> {
        const { provider, providerId, email, name } = params;

        // email 충돌 검사 (LOCAL 계정 보호)
        if (email) {
            const exists = await this.prisma.user.findFirst({
                where: {
                    email,
                    provider: AuthProvider.LOCAL,
                },
            });

            if (exists) {
                throw new ConflictException('이미 LOCAL 계정이 존재함');
            }
        }

        return this.prisma.user.create({
            data: {
                provider,
                providerId,
                email,
                name,
            },
        });
    }
}
