import { Test } from '@nestjs/testing';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as fs from 'fs';

async function generateSwagger() {
    let app;

    try {
        // 🟡 Fix: JwtStrategy requires a secret
        process.env.JWT_SECRET = 'fix-for-swagger-generation';

        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue({
                onModuleInit: async () => { },
                onModuleDestroy: async () => { },
                $connect: async () => { },
                $disconnect: async () => { },
            })
            .compile();

        app = moduleFixture.createNestApplication({ logger: false });

        const config = new DocumentBuilder()
            .setTitle('CRATE API')
            .setDescription('CRATE Backend API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);

        fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
        console.log('Swagger spec generated: swagger-spec.json');

    } catch (error) {
        console.error('Failed to generate Swagger spec:', error);
        process.exit(1);
    } finally {
        if (app) {
            try {
                await app.close();
            } catch (closeError) {
                console.error('Error closing application:', closeError);
            }
        }
    }
}

generateSwagger();
