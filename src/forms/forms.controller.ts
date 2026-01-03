import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    Req,
    UseGuards,
    NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { FormsService } from '@/forms/forms.service';

import { CreateFormDto } from '@/forms/dto/create-form.dto';
import { UpdateFormDto } from '@/forms/dto/update-form.dto';
import { CreateFormDraftDto } from '@/forms/dto/draft/create-form-draft.dto';
import { CreateFormPublishDto } from '@/forms/dto/draft/create-form-publish.dto';


@ApiTags('Forms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    // 생성
    @Post()
    @ApiOperation({ summary: '새로운 폼 생성', description: '제목과 설명을 입력받아 새로운 폼을 생성합니다.' })
    @ApiResponse({ status: 201, description: '생성 성공' })
    create(@Req() req: Request & { user: { id: string } },
        @Body() dto: CreateFormDto) {
        return this.formsService.create(req.user.id, dto);
    }

    // 조회
    @Get()
    @ApiOperation({ summary: '내 폼 목록 조회', description: '사용자가 생성한 모든 폼 목록을 조회합니다.' })
    @ApiResponse({ status: 200, description: '조회 성공' })
    findAll(@Req() req: Request & { user: { id: string } }) {
        return this.formsService.findAll(req.user.id);
    }

    // 단건 조회
    @Get(':id')
    @ApiOperation({ summary: '폼 상세 조회', description: '특정 폼의 상세 정보를 조회합니다.' })
    @ApiParam({ name: 'id', description: '폼 ID' })
    @ApiResponse({ status: 200, description: '조회 성공' })
    @ApiResponse({ status: 404, description: '폼을 찾을 수 없음' })
    async findOne(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
        const form = await this.formsService.findOne(req.user.id, id);
        if (!form) throw new NotFoundException('Form not found');
        return form;
    }

    // 수정
    @Patch(':id')
    @ApiOperation({ summary: '폼 정보 수정', description: '폼의 제목이나 설명을 수정합니다.' })
    @ApiParam({ name: 'id', description: '폼 ID' })
    @ApiResponse({ status: 200, description: '수정 성공' })
    @ApiResponse({ status: 404, description: '폼을 찾을 수 없음' })
    async update(
        @Req() req: Request & { user: { id: string } },
        @Param('id') id: string,
        @Body() dto: UpdateFormDto,
    ) {
        const result = await this.formsService.update(req.user.id, id, dto);
        if (result.count === 0) throw new NotFoundException('Form not found');
        return { success: true };
    }

    // 삭제 (soft delete)
    @Delete(':id')
    @ApiOperation({ summary: '폼 삭제', description: '폼을 삭제합니다 (Soft Delete).' })
    @ApiParam({ name: 'id', description: '폼 ID' })
    @ApiResponse({ status: 200, description: '삭제 성공' })
    @ApiResponse({ status: 404, description: '폼을 찾을 수 없음' })
    async remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
        const result = await this.formsService.remove(req.user.id, id);
        if (result.count === 0) throw new NotFoundException('Form not found');
        return { success: true };
    }

    // Draft 저장
    @Post('draft')
    @ApiOperation({ summary: '폼 초안 저장 (전체)', description: '폼 정보와 질문 목록을 포함하여 초안 상태로 저장합니다.' })
    @ApiResponse({ status: 201, description: '저장 성공' })
    createDraft(
        @Req() req: Request & { user: { id: string } },
        @Body() dto: CreateFormDraftDto,
    ) {
        return this.formsService.createDraftWithQuestions(req.user.id, dto);
    }

    // Publish 저장
    @Post('publish')
    @ApiOperation({ summary: '폼 게시 (전체)', description: '폼 정보와 질문 목록을 포함하여 게시 상태로 저장합니다.' })
    @ApiResponse({ status: 201, description: '게시 성공' })
    publish(
        @Req() req: Request & { user: { id: string } },
        @Body() dto: CreateFormPublishDto,
    ) {
        return this.formsService.publishWithQuestions(req.user.id, dto);
    }


}
