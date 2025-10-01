import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService, { strict: false });

  const PORT = configService.get('PORT');
  await app.listen(PORT ?? 3000, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
