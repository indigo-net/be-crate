import { Module } from '@nestjs/common';
import { FormsController } from '@/forms/forms.controller';
import { FormsService } from '@/forms/forms.service';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [FormsController],
    providers: [FormsService],
})
export class FormsModule { }
