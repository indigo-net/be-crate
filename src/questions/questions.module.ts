import { Module } from '@nestjs/common';
import { QuestionsController } from '@/questions/questions.controller';
import { QuestionsService } from '@/questions/questions.service';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [QuestionsController],
    providers: [QuestionsService],
})
export class QuestionsModule { }
