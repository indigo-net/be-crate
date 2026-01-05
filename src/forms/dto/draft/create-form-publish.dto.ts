import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
    MaxLength,
    IsDateString,
    IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionType {
    SHORT_TEXT = 'SHORT_TEXT',
    LONG_TEXT = 'LONG_TEXT',
    SINGLE_CHOICE = 'SINGLE_CHOICE',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    DATE = 'DATE',
    FILE = 'FILE',
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

    @IsInt()
    @IsOptional()
    weight?: number;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionOptionDto)
    options?: CreateQuestionOptionDto[];
}

class CreateFormPayloadDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    description?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;
}

export class CreateFormPublishDto {
    @ValidateNested()
    @Type(() => CreateFormPayloadDto)
    form: CreateFormPayloadDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}
