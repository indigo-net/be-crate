import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 전역으로 써먹기
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
