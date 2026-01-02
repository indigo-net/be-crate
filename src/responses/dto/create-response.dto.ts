import { IsString, IsOptional, IsArray } from 'class-validator';
import { CreateResponseAnswerDto } from './create-response-answer.dto';

export class CreateResponseDto {
    @IsString()
    formId: string;

    @IsOptional()
    @IsString()
    publicToken?: string;

    @IsArray()
    answers: CreateResponseAnswerDto[];
}
