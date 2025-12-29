import { Controller, Post, UseGuards, Body, Req } from "@nestjs/common";
import { OptionalJwtAuthGuard } from "@/auth/guards/optional-jwt-auth.guard";
import { ResponseService } from "@/responses/responses.service";
import { CreateResponseDto } from "@/responses/dto/create-response.dto";

@Controller('responses')
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService,
    ) { }

    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    async create(@Body() dto: CreateResponseDto, @Req() req: any) {
        return this.responseService.create(dto, req.user);
    }
}

