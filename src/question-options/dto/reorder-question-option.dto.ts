import { IsArray, IsUUID } from 'class-validator';

export class ReorderQuestionOptionDto {
    @IsArray()
    @IsUUID('4', { each: true })
    orderedOptionIds: string[];
}
