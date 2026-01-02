import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { FormsModule } from '@/forms/forms.module';
import { QuestionsModule } from '@/questions/questions.module';
import { QuestionOptionsModule } from '@/question-options/question-options.module';
import { ResponsesModule } from '@/responses/responses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    FormsModule,
    QuestionsModule,
    QuestionOptionsModule,
    ResponsesModule,
  ],
})
export class AppModule { }
