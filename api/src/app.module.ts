import { Module } from '@nestjs/common';
import { ProducerModule } from './modules/producer/infrastructure/producer.module';
import { DatabaseModule } from '@agromanager/infra/database/module';
import { ConfigModule } from '@nestjs/config';
import configuration from './shared/infrastructure/config/configuration';
import { envSchema } from './shared/infrastructure/config/dto/env.dto';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { RedisModule } from '@agromanager/infra/redis/module';
import { MigrationModule } from './modules/migration/infrastructure/migration.module';
import { CultureModule } from './modules/culture/infrastructure/culture.module';
import { PropertyModule } from './modules/property/infrastructure/property.module';
import { CropModule } from './modules/crop/infrastructure/crop.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalErrorHandler } from './shared/infrastructure/filters/globalErrorHandler';
import { NotificationModule } from './modules/notification/infrastructure/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
      validate: (env) => envSchema.parse(env),
    }),
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: ['REDIS_CLIENT'],
      useFactory: (redis: Redis) => ({
        throttlers: [{ ttl: 60000, limit: 30 }],
        storage: new ThrottlerStorageRedisService(redis),
      }),
    }),
    EventEmitterModule.forRoot(),
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
