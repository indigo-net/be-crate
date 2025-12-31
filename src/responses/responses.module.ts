import { Module } from "@nestjs/common";
import { ResponseController } from "@/responses/responses.controller";
import { ResponseService } from "@/responses/responses.service";

@Module({
    controllers: [ResponseController],
    providers: [ResponseService],
})
export class ResponsesModule { }
