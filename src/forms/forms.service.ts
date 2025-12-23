import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma/prisma.service";
import { CreateFormDto } from "@/forms/dto/create-form.dto";
import { UpdateFormDto } from "@/forms/dto/update-form.dto";

@Injectable()
export class FormsService {
    constructor(private readonly prisma: PrismaService) { }

    // 폼 생성
    create(userId: string, dto: CreateFormDto) {
        return this.prisma.form.create({
            data: {
                title: dto.title,
                description: dto.description,
                owner_id: userId,
            },
        });
    }

    // 폼 조회
    findAll(userId: string) {
        return this.prisma.form.findMany({
            where: {
                owner_id: userId,
                is_active: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    // 폼 단건 조회
    findOne(userId: string, formId: string) {
        // findUnique 쓰면 권한 조건 못 넣음.
        // 안 나오면 null 반환 → 컨트롤러에서 처리.
        return this.prisma.form.findFirst({
            where: {
                id: formId,
                owner_id: userId,
                is_active: true,
            },
        });
    }

    // 폼 수정
    update(userId: string, formId: string, dto: UpdateFormDto) {
        return this.prisma.form.updateMany({
            where: {
                id: formId,
                owner_id: userId,
                is_active: true,
            },
            data: {
                ...dto,
            },
        });
    }

    // 폼 삭제
    remove(userId: string, formId: string) {
        // delete 사용하지 않고 복구 여지 남기기. 
        return this.prisma.form.updateMany({
            where: {
                id: formId,
                owner_id: userId,
                is_active: true,
            },
            data: {
                is_active: false,
            },
        });
    }




}
