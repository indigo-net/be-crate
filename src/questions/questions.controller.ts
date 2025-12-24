import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { QuestionsService } from '@/questions/questions.service';

import { CreateQuestionDto } from '@/questions/dto/create-question.dto';
import { UpdateQuestionDto } from '@/questions/dto/update-question.dto';
import { ReorderQuestionsDto } from '@/questions/dto/reorder-questions.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('forms/:formId/questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    // 질문 생성
    @Post()
    create(
        @Param('formId') formId: string,
        @Req() req: Request & { user: { id: string } },
        @Body() dto: CreateQuestionDto,
    ) {
        return this.questionsService.create(formId, req.user.id, dto);
    }

    // 질문들 조회
    @Get()
    findAll(
        @Param('formId') formId: string,
        @Req() req: Request & { user: { id: string } },
    ) {
        return this.questionsService.findAll(formId, req.user.id);
    }

    // 질문 순서 재배치
    @Patch('reorder')
    @UsePipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    )
    reorder(
        @Param('formId') formId: string,
        @Req() req: Request & { user: { id: string } },
        @Body() dto: ReorderQuestionsDto,
    ) {
        return this.questionsService.reorder(
            formId,
            req.user.id,
            dto.questionIds,
        );
    }
    /* NestJS 라우팅 주의사항
     *
     * - 정적 라우트(@Patch('reorder'))는
     *   동적 라우트(@Patch(':id'))보다 반드시 위에 선언해야 한다.
     *
     * - 선언 순서가 뒤집히면
     *   'reorder'가 ':id'로 매칭되어
     *   의도하지 않은 핸들러(update 등)가 실행된다.
     *
     * - 이 경우:
     *   - 실제 메서드는 호출되지 않음
     *   - DTO 로그도 찍히지 않음
     *   - ValidationPipe 에러가 DTO 문제처럼 보임
     *
     * - 해결:
     *   1. 정적 라우트를 위에 배치
     *   2. 라우트 구조를 파라미터와 겹치지 않게 설계
     *   3. 라우트 순서 변경 후 서버 재시작 권장
     */


    // 질문 수정
    @Patch(':id')
    @ApiParam({
        name: 'formId',
        required: true,
        description: '폼 ID',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: '질문 ID',
    })
    update(
        @Param('id') id: string,
        @Req() req: Request & { user: { id: string } },
        @Body() dto: UpdateQuestionDto,
    ) {
        return this.questionsService.update(id, req.user.id, dto);
    }

    // 질문 삭제
    @Delete(':id')
    @ApiParam({
        name: 'formId',
        required: true,
        description: '폼 ID',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: '질문 ID',
    })
    remove(
        @Param('id') id: string,
        @Req() req: Request & { user: { id: string } },
    ) {
        return this.questionsService.remove(id, req.user.id);
    }


}
