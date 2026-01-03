import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResponseAnswerDto {
    @ApiProperty({ description: '질문 ID', example: 'uuid-question-id' })
    @IsString()
    questionId: string;

    @ApiPropertyOptional({ description: '주관식 답변 (단답/장문)', example: '답변 내용입니다.' })
    @IsOptional()
    @IsString()
    valueText?: string;

    @ApiPropertyOptional({ description: '객관식 선택지 ID', example: 'uuid-option-id' })
    @IsOptional()
    @IsString()
    optionId?: string;
}
