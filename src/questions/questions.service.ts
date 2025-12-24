import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { QuestionType } from '@prisma/client';

interface CreateQuestionInput {
  title: string;
  type: QuestionType;
  is_required?: boolean;
}

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) { }

  // 질문들 생성
  async create(formId: string, userId: string, input: CreateQuestionInput) {
    // 1. Form 소유자 확인
    const form = await this.prisma.form.findFirst({
      where: {
        id: formId,
        owner_id: userId,
        is_active: true,
      },
    });

    if (!form) {
      throw new ForbiddenException('Form not accessible');
    }

    // 2. order_index 계산 (마지막 + 1)
    const lastQuestion = await this.prisma.question.findFirst({
      where: { form_id: formId },
      orderBy: { order_index: 'desc' },
    });

    const nextOrderIndex = lastQuestion ? lastQuestion.order_index + 1 : 0;

    // 3. Question 생성
    return this.prisma.question.create({
      data: {
        form_id: formId,
        title: input.title,
        type: input.type,
        is_required: input.is_required ?? false,
        order_index: nextOrderIndex,
      },
    });
  }

  // 전체 질문 조회
  async findAll(formId: string, userId: string) {
    // form 소유자 검증
    const form = await this.prisma.form.findFirst({
      where: {
        id: formId,
        owner_id: userId,
        is_active: true,
      },
    });

    if (!form) {
      throw new ForbiddenException('Form not accessible');
    }

    // 질문 목록 조회
    return this.prisma.question.findMany({
      where: {
        form_id: formId,
      },
      orderBy: {
        order_index: 'asc',
      },
    });
  }

  // 질문 수정
  async update(
    questionId: string,
    userId: string,
    input: { title?: string; is_required?: boolean },
  ) {
    // 질문 + 소유자 검증
    const question = await this.prisma.question.findFirst({
      where: {
        id: questionId,
        form: {
          owner_id: userId,
          is_active: true,
        },
      },
    });

    if (!question) {
      throw new ForbiddenException('Question not accessible');
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: {
        title: input.title,
        is_required: input.is_required,
      },
    });
  }

  // 질문 삭제(완전)
  async remove(questionId: string, userId: string) {
    // 1. 질문 + 소유자 검증
    const question = await this.prisma.question.findFirst({
      where: {
        id: questionId,
        form: {
          owner_id: userId,
          is_active: true,
        },
      },
    });

    if (!question) {
      throw new ForbiddenException('Question not accessible');
    }

    const { form_id, order_index } = question;

    // 2. 질문 삭제
    await this.prisma.question.delete({
      where: { id: questionId },
    });

    // 3. 뒤에 있는 질문들 order_index 당기기
    await this.prisma.question.updateMany({
      where: {
        form_id,
        order_index: { gt: order_index },
      },
      data: {
        order_index: { decrement: 1 },
      },
    });

    return { success: true };
  }

  // 질문 순서 재배치
  async reorder(
    formId: string,
    userId: string,
    questionIds: string[],
  ) {
    // 1. form 소유자 검증
    const form = await this.prisma.form.findFirst({
      where: {
        id: formId,
        owner_id: userId,
        is_active: true,
      },
    });

    if (!form) {
      throw new ForbiddenException('Form not accessible');
    }

    // 2. 트랜잭션으로 순서 재배치
    await this.prisma.$transaction(
      questionIds.map((id, index) =>
        this.prisma.question.update({
          where: { id },
          data: { order_index: index },
        }),
      ),
    );

    return { success: true };
  }




}
