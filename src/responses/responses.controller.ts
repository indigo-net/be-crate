import { Controller, Post, UseGuards, Body, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from "@/auth/guards/optional-jwt-auth.guard";
import { ResponseService } from "@/responses/responses.service";
import { CreateResponseDto } from "@/responses/dto/create-response.dto";

@ApiTags('Responses')
@Controller('responses')
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService,
    ) { }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: '설문 응답 제출', description: '작성한 설문 응답을 제출합니다. (로그인시 회원 연결, 비회원도 가능)' })
    @ApiResponse({ status: 201, description: '제출 성공' })
    @UseGuards(OptionalJwtAuthGuard)
    async create(@Body() dto: CreateResponseDto, @Req() req: any) {
        return this.responseService.create(dto, req.user);
    }
}

