import { IsString, IsOptional, MaxLength, IsDateString } from 'class-validator';

export class UpdateFormDto {
    @IsString()
    @IsOptional()
    @MaxLength(30)
    title?: string;

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
