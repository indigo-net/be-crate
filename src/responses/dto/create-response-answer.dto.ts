import { IsString, IsOptional } from 'class-validator';

export class CreateResponseAnswerDto {
    @IsString()
    questionId: string;

    @IsOptional()
    @IsString()
    valueText?: string;

    @IsOptional()
    @IsString()
    optionId?: string;
}
