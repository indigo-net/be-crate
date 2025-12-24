import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateQuestionDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsBoolean()
    @IsOptional()
    is_required?: boolean;
}
