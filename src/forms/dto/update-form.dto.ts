import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFormDto {
    @ApiPropertyOptional({ description: '폼 제목 수정', example: '수정된 설문조사 제목' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ description: '폼 설명 수정', example: '수정된 설문조사 설명' })
    @IsString()
    @IsOptional()
    description?: string;
}
