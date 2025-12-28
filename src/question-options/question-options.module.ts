import { Module } from '@nestjs/common';
import { QuestionOptionsService } from '@/question-options/question-options.service';
import { QuestionOptionsController } from '@/question-options/question-options.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QuestionOptionsService],
  controllers: [QuestionOptionsController],
})
export class QuestionOptionsModule { }
