import { Module } from '@nestjs/common';
import { FormsController } from '@/forms/forms.controller';
import { FormsService } from '@/forms/forms.service';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { RefreshTokenService } from '@/auth/refresh-token.service';

@Module({
    imports: [PrismaModule],
    controllers: [FormsController],
    providers: [FormsService, RefreshTokenService],
})
export class FormsModule { }
