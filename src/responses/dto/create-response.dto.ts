import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateResponseAnswerDto } from './create-response-answer.dto';

export class CreateResponseDto {
    @ApiProperty({ description: '폼 ID', example: 'uuid-form-id' })
    @IsString()
    formId: string;

    @ApiPropertyOptional({ description: '퍼블릭 토큰 (비회원 응답 시)', example: 'public-token-string' })
    @IsOptional()
    @IsString()
    publicToken?: string;

    @ApiProperty({ type: [CreateResponseAnswerDto], description: '응답 목록' })
    @IsArray()
    answers: CreateResponseAnswerDto[];
}
