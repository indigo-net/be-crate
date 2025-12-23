import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    // 앱 시작 시 DB 연결
    async onModuleInit() {
        await this.$connect();
    }

    // 앱 종료 시 DB 연결 해제
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
