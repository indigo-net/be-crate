import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';
import dayjs from 'dayjs';

@Injectable()
export class RefreshTokenService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /* =====================
     * refresh token 생성
     * ===================== */
    generateToken(): string {
        return randomBytes(64).toString('hex');
    }

    /* =====================
     * refresh token 해시
     * ===================== */
    hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    /* =====================
     * refresh token 발급 + 저장
     * ===================== */
    async issue(userId: string): Promise<string> {
        const token = this.generateToken();
        const tokenHash = this.hashToken(token);

        await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt: dayjs().add(14, 'day').toDate(),
            },
        });

        return token; // 원문은 여기서만
    }

    /* =====================
     * refresh token 검증
     * ===================== */
    async validate(token: string) {
        const tokenHash = this.hashToken(token);

        const record = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
        });

        if (!record) {
            throw new UnauthorizedException('유효하지 않은 refresh token');
        }

        if (record.revokedAt) {
            throw new UnauthorizedException('폐기된 refresh token');
        }

        if (dayjs(record.expiresAt).isBefore(dayjs())) {
            throw new UnauthorizedException('만료된 refresh token');
        }

        return record;
    }

    /* =====================
     * refresh token 폐기
     * ===================== */
    async revoke(token: string): Promise<void> {
        const tokenHash = this.hashToken(token);

        await this.prisma.refreshToken.updateMany({
            where: {
                tokenHash,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}
