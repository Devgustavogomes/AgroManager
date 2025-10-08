import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService, { strict: false });

  const PORT = configService.get('PORT') ?? 3000;

  await app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}

bootstrap();
