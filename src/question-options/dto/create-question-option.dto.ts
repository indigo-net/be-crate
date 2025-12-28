import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOptionItemDto {
    @IsString()
    label: string;

    @IsOptional()
    @IsString()
    value?: string;

    @IsInt()
    @Min(0)
    orderIndex: number;
}

export class CreateQuestionOptionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOptionItemDto)
    options: CreateOptionItemDto[];
}
