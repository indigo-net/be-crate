import { CreateResponseAnswerDto } from './create-response-answer.dto';

export class CreateResponseDto {
    formId: string;

    // 외부 응답용
    publicToken?: string;

    answers: CreateResponseAnswerDto[];
}
