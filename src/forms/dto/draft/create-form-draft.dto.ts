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

export enum QuestionType {
    SHORT_TEXT = 'SHORT_TEXT',
    LONG_TEXT = 'LONG_TEXT',
    SINGLE_CHOICE = 'SINGLE_CHOICE',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

class CreateQuestionOptionDto {
    @IsString()
    @IsNotEmpty()
    label: string;

    @IsString()
    @IsOptional()
    value?: string;
}

class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(QuestionType)
    type: QuestionType;

    @IsBoolean()
    isRequired: boolean;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionOptionDto)
    options?: CreateQuestionOptionDto[];
}

class CreateFormPayloadDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class CreateFormDraftDto {
    @ValidateNested()
    @Type(() => CreateFormPayloadDto)
    form: CreateFormPayloadDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}
