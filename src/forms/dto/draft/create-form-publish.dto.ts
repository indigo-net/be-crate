import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum QuestionType {
    SHORT_TEXT = 'SHORT_TEXT',
    LONG_TEXT = 'LONG_TEXT',
    SINGLE_CHOICE = 'SINGLE_CHOICE',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

class CreateQuestionOptionDto {
    @ApiProperty({ description: '옵션 라벨', example: '옵션 1' })
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiPropertyOptional({ description: '옵션 값', example: 'option_1' })
    @IsString()
    @IsOptional()
    value?: string;
}

class CreateQuestionDto {
    @ApiProperty({ description: '질문 제목', example: '가장 좋아하는 색깔은?' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ enum: QuestionType, description: '질문 유형', example: QuestionType.SINGLE_CHOICE })
    @IsEnum(QuestionType)
    type: QuestionType;

    @ApiProperty({ description: '필수 여부', example: true })
    @IsBoolean()
    isRequired: boolean;

    @ApiPropertyOptional({ type: [CreateQuestionOptionDto], description: '질문 옵션 목록 (객관식일 경우)' })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionOptionDto)
    options?: CreateQuestionOptionDto[];
}

class CreateFormPayloadDto {
    @ApiProperty({ description: '폼 제목', example: '설문조사 제목' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ description: '폼 설명', example: '설문조사 설명' })
    @IsString()
    @IsOptional()
    description?: string;
}

export class CreateFormPublishDto {
    @ApiProperty({ type: CreateFormPayloadDto, description: '폼 기본 정보' })
    @ValidateNested()
    @Type(() => CreateFormPayloadDto)
    form: CreateFormPayloadDto;

    @ApiProperty({ type: [CreateQuestionDto], description: '질문 목록' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}
