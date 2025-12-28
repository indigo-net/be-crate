import { IsArray, IsUUID } from 'class-validator';

export class DeleteQuestionOptionDto {
    @IsArray()
    @IsUUID('4', { each: true })
    optionIds: string[];
}
