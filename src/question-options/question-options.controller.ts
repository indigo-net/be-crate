import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { QuestionOptionsService } from '@/question-options/question-options.service';
import { CreateQuestionOptionDto } from '@/question-options/dto/create-question-option.dto';
import { ReorderQuestionOptionDto } from '@/question-options/dto/reorder-question-option.dto';
import { DeleteQuestionOptionDto } from '@/question-options/dto/delete-question-option.dto';

@Controller('questions/:questionId/options')
export class QuestionOptionsController {
    constructor(private readonly service: QuestionOptionsService) { }

    @Post()
    create(
        @Param('questionId') questionId: string,
        @Body() dto: CreateQuestionOptionDto,
    ) {
        return this.service.createOptions(questionId, dto.options);
    }

    @Patch('reorder')
    reorder(
        @Param('questionId') questionId: string,
        @Body() dto: ReorderQuestionOptionDto,
    ) {
        return this.service.reorderOptions(questionId, dto.orderedOptionIds);
    }

    @Delete()
    delete(
        @Param('questionId') questionId: string,
        @Body() dto: DeleteQuestionOptionDto,
    ) {
        return this.service.deleteOptions(questionId, dto.optionIds);
    }
}
