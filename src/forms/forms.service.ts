import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma/prisma.service";
import { CreateFormDto } from "@/forms/dto/create-form.dto";
import { UpdateFormDto } from "@/forms/dto/update-form.dto";
import { CreateFormDraftDto } from "@/forms/dto/draft/create-form-draft.dto";
import { CreateFormPublishDto } from "@/forms/dto/draft/create-form-publish.dto";
import { FormStatus } from "@prisma/client";

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

    // 폼 단건 조회(질문, 옵션 포함)
    findOne(userId: string, formId: string) {
        // findUnique 쓰면 권한 조건 못 넣음.
        // 안 나오면 null 반환 → 컨트롤러에서 처리.
        return this.prisma.form.findFirst({
            where: {
                id: formId,
                owner_id: userId,
                is_active: true,
            },
            include: {
                questions: {
                    orderBy: { order_index: 'asc' },
                    include: {
                        options: {
                            orderBy: { order_index: 'asc' },
                        },
                    },
                },
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

    // =========================
    // Draft / Publish
    // =========================
    async createDraftWithQuestions(
        userId: string,
        dto: CreateFormDraftDto,
    ) {
        return this.createFormWithQuestions(
            userId,
            dto,
            FormStatus.DRAFT,
        );
    }

    async publishWithQuestions(
        userId: string,
        dto: CreateFormPublishDto,
    ) {
        return this.createFormWithQuestions(
            userId,
            dto,
            FormStatus.PUBLISHED,
        );
    }

    private async createFormWithQuestions(
        userId: string,
        dto: CreateFormDraftDto | CreateFormPublishDto,
        status: FormStatus,
    ) {
        const { form, questions } = dto;

        return this.prisma.$transaction(async tx => {
            // 1. Form 생성
            const createdForm = await tx.form.create({
                data: {
                    title: form.title,
                    description: form.description,
                    owner_id: userId,
                    status,
                },
            });

            // 2. Question 생성
            for (let i = 0; i < questions.length; i++) {
                const question = questions[i];

                const createdQuestion = await tx.question.create({
                    data: {
                        form_id: createdForm.id,
                        title: question.title,
                        type: question.type,
                        is_required: question.isRequired,
                        order_index: i,
                    },
                });

                // 3. Option 생성 (있을 때만)
                if (question.options?.length) {
                    await tx.questionOption.createMany({
                        data: question.options.map((option, idx) => ({
                            question_id: createdQuestion.id,
                            label: option.label,
                            value: option.value,
                            order_index: idx,
                        })),
                    });
                }
            }

            return createdForm;
        });
    }



}
