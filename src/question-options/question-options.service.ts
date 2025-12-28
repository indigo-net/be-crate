import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';


@Injectable()
export class QuestionOptionsService {
    constructor(private readonly prisma: PrismaService) { }

    // 옵션 생성
    async createOptions(
        questionId: string,
        options: {
            label: string;
            value?: string;
            orderIndex: number;
        }[],
    ) {
        if (options.length === 0) return [];

        return this.prisma.$transaction(async (tx) => {
            // 1. 질문 존재 + 타입 체크
            const question = await tx.question.findUnique({
                where: { id: questionId },
                select: { id: true, type: true },
            });

            if (!question) {
                throw new NotFoundException('Question not found');
            }

            if (!['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(question.type)) {
                throw new BadRequestException('This question type does not support options');
            }

            // 2. bulk create
            await tx.questionOption.createMany({
                data: options.map((opt) => ({
                    question_id: questionId,
                    label: opt.label,
                    value: opt.value,
                    order_index: opt.orderIndex,
                })),
            });

            // 3. 생성된 옵션 반환
            return tx.questionOption.findMany({
                where: { question_id: questionId },
                orderBy: { order_index: 'asc' },
            });
        });
    }


    // 옵션 재정렬
    async reorderOptions(
        questionId: string,
        orderedOptionIds: string[],
    ) {
        if (orderedOptionIds.length === 0) return;

        return this.prisma.$transaction(async (tx) => {
            // 1. 해당 question의 옵션인지 검증
            const options = await tx.questionOption.findMany({
                where: {
                    id: { in: orderedOptionIds },
                    question_id: questionId,
                },
                select: { id: true },
            });

            if (options.length !== orderedOptionIds.length) {
                throw new Error('Invalid option ids for this question');
            }

            // 2. 순서대로 order_index 업데이트
            const updates = orderedOptionIds.map((id, index) =>
                tx.questionOption.update({
                    where: { id },
                    data: { order_index: index },
                }),
            );

            await Promise.all(updates);

            // 3. 최종 상태 반환
            return tx.questionOption.findMany({
                where: { question_id: questionId },
                orderBy: { order_index: 'asc' },
            });
        });
    }


    // 옵션 삭제
    async deleteOptions(
        questionId: string,
        optionIds: string[],
    ) {
        if (optionIds.length === 0) return;

        return this.prisma.$transaction(async (tx) => {
            // 1. 해당 question의 옵션인지 검증
            const options = await tx.questionOption.findMany({
                where: {
                    id: { in: optionIds },
                    question_id: questionId,
                },
                select: { id: true },
            });

            if (options.length !== optionIds.length) {
                throw new Error('Invalid option ids for this question');
            }

            // 2. 삭제
            await tx.questionOption.deleteMany({
                where: {
                    id: { in: optionIds },
                    question_id: questionId,
                },
            });

            // 3. 남은 옵션 정렬 재조회
            return tx.questionOption.findMany({
                where: { question_id: questionId },
                orderBy: { order_index: 'asc' },
            });
        });
    }

}
