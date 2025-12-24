import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class ReorderQuestionsDto {
    @ApiProperty({
        type: [String],
        example: [
            "d4c6893f-12a5-4974-9e59-ce0c29e36d43",
            "e734dd9c-a144-409f-a3ff-74daa7dece88",
            "9602fcf0-c74e-4845-92b6-224da3837ee6"
        ],
    })
    @IsArray()
    @IsUUID('all', { each: true })
    questionIds: string[];
}
