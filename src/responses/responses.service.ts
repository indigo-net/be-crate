import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateResponseDto } from '@/responses/dto/create-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class ResponseService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateResponseDto, user?: User) {
        const { formId, publicToken, answers } = dto;

        if (!user && !publicToken) {
            throw new ForbiddenException();
        }

        const form = await this.prisma.form.findFirst({
            where: { id: formId, is_active: true },
            include: {
                questions: {
                    include: { options: true },
                },
            },
        });

        if (!form) throw new NotFoundException();

        // questionId 중복 체크
        const questionIdSet = new Set(answers.map(a => a.questionId));
        if (questionIdSet.size !== answers.length) {
            throw new BadRequestException('duplicate question');
        }

        // 필수 질문 체크 + 타입 검증
        for (const q of form.questions) {
            const answer = answers.find(a => a.questionId === q.id);

            if (q.is_required && !answer) {
                throw new BadRequestException('required question missing');
            }

            if (!answer) continue;

            switch (q.type) {
                case 'SHORT_TEXT':
                case 'LONG_TEXT':
                    if (!answer.valueText || answer.optionId) {
                        throw new BadRequestException('invalid text answer');
                    }
                    break;

                case 'SINGLE_CHOICE':
                case 'MULTIPLE_CHOICE':
                    if (!answer.optionId || answer.valueText) {
                        throw new BadRequestException('invalid choice answer');
                    }
                    if (!q.options.some(o => o.id === answer.optionId)) {
                        throw new BadRequestException('option not belongs to question');
                    }
                    break;
            }
        }

        // 트랜잭션
        return this.prisma.$transaction(async tx => {
            const response = await tx.response.create({
                data: {
                    form_id: form.id,
                    responderId: user?.id ?? null,
                    publicToken: publicToken ?? null,
                },
            });

            for (const a of answers) {
                await tx.responseAnswer.create({
                    data: {
                        response_id: response.id,
                        question_id: a.questionId,
                        value_text: a.valueText ?? null,
                        option_id: a.optionId ?? null,
                    },
                });
            }

            return response.id;
        });
    }
}
