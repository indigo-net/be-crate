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
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { FormsService } from '@/forms/forms.service';

import { CreateFormDto } from '@/forms/dto/create-form.dto';
import { UpdateFormDto } from '@/forms/dto/update-form.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // 모두 토큰을 넘기므로 내가 만든 폼 / 내가 만든 폼 조회
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    // 생성
    @Post()
    create(@Req() req: Request & { user: { id: string } },
        @Body() dto: CreateFormDto) {
        return this.formsService.create(req.user.id, dto);
    }

    // 조회
    @Get()
    findAll(@Req() req: Request & { user: { id: string } }) {
        return this.formsService.findAll(req.user.id);
    }

    // 단건 조회
    @Get(':id')
    async findOne(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
        const form = await this.formsService.findOne(req.user.id, id);
        if (!form) throw new NotFoundException('Form not found');
        return form;
    }

    // 수정
    @Patch(':id')
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
    async remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
        const result = await this.formsService.remove(req.user.id, id);
        if (result.count === 0) throw new NotFoundException('Form not found');
        return { success: true };
    }

}
