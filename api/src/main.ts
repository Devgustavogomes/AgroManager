import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

export default async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const logger = setupLogger(app);

  const configService = app.get(ConfigService, { strict: false });

  setupSecurity(app, configService);

  setupSwagger(app);

  app.useGlobalPipes(new ZodValidationPipe());

  const PORT = configService.get('PORT') ?? 3000;

  app.set('trust proxy', 'loopback');

  app.use(cookieParser());

  await app.listen(PORT, () => {
    logger.log(`🚀 Server running on PORT ${PORT}`);
  });
}

function setupLogger(app: NestExpressApplication) {
  const logger = app.get(Logger);
  app.useLogger(logger);
  return logger;
}

function setupSecurity(
  app: NestExpressApplication,
  configService: ConfigService,
) {
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

function setupSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('AgroManager API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

void bootstrap();
