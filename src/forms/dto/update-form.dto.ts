import { IsString, IsOptional } from 'class-validator';

export class UpdateFormDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
