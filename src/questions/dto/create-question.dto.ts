import { IsEnum, IsOptional, IsBoolean, IsString, IsNotEmpty, IsInt } from 'class-validator';
import { QuestionType } from '@prisma/client';

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(QuestionType)
    type: QuestionType;

    @IsBoolean()
    @IsOptional()
    is_required?: boolean;

    @IsInt()
    @IsOptional()
    weight?: number;
}
