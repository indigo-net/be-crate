import { IsString, IsOptional, IsNotEmpty, MaxLength, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFormDto {
    @ApiProperty({ description: '폼 제목', example: '설문조사 제목' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    title: string;

    @ApiPropertyOptional({ description: '폼 설명', example: '설문조사에 대한 설명입니다.' })
    @IsString()
    @IsOptional()
    @MaxLength(150)
    description?: string;

    @ApiPropertyOptional({ description: '시작 일시', example: '2024-01-01T00:00:00Z' })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({ description: '종료 일시', example: '2024-01-31T23:59:59Z' })
    @IsDateString()
    @IsOptional()
    endDate?: string;
}
