import { Module } from '@nestjs/common';
import { ProducerModule } from './modules/producer/infrastructure/producer.module';
import { DatabaseModule } from '@agromanager/infra/database/module';
import { ConfigModule } from '@nestjs/config';
import configuration from './shared/config/configuration';
import { envSchema } from './shared/config/dto/env.dto';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { RedisModule } from '@agromanager/infra/redis/module';
import { MigrationModule } from './modules/migration/module';
import { CultureModule } from './modules/culture/infrastructure/culture.module';
import { PropertyModule } from './modules/property/infrastructure/property.module';
import { CropModule } from './modules/crop/infrastructure/crop.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalErrorHandler } from './shared/filters/globalErrorHandler';
import { NotificationModule } from './modules/notification/infrastructure/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
      validate: (env) => envSchema.parse(env),
    }),
    ProducerModule,
    DatabaseModule,
    AuthModule,
    RedisModule,
    MigrationModule,
    PropertyModule,
    CultureModule,
    CropModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalErrorHandler,
    },
  ],
})
export class AppModule {}
