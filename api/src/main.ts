import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

export default async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService, { strict: false });

  app.useGlobalPipes(new ZodValidationPipe());

  setupSecurity(app, configService);

  setupSwagger(app);

  const PORT = configService.get('PORT') ?? 3000;
  await app.listen(PORT, () => {
    console.log(`🚀 Server running on PORT ${PORT}`);
  });
}

function setupSecurity(app: INestApplication, configService: ConfigService) {
  const isProducao = process.env.NODE_ENV === 'production';

  const originAllowed =
    configService.get('FRONTEND_URL') || 'http://localhost:3000';

  app.enableCors({
    origin: originAllowed,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: { policy: 'same-site' },
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      strictTransportSecurity: isProducao ? undefined : false,
    }),
  );
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('AgroManager API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

bootstrap().catch(console.error);
