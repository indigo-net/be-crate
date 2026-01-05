import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

export class UpdateQuestionDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsBoolean()
    @IsOptional()
    is_required?: boolean;

    @IsInt()
    @IsOptional()
    weight?: number;
}
