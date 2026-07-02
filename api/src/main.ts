import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

export default async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProducao = process.env.NODE_ENV === 'production';

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

  app.useGlobalPipes(new ZodValidationPipe());

  const configService = app.get(ConfigService, { strict: false });

  const PORT = configService.get('PORT') ?? 3000;

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('AgroManager API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}

bootstrap().catch(console.error);
