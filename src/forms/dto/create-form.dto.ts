import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFormDto {
    @ApiProperty({ description: '폼 제목', example: '설문조사 제목' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ description: '폼 설명', example: '설문조사에 대한 설명입니다.' })
    @IsString()
    @IsOptional()
    description?: string;
}
