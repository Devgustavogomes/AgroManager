import { Module } from '@nestjs/common';
import { ProducerModule } from './modules/producer/infrastructure/producer.module';
import { DatabaseModule } from '@agromanager/infra/database/module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { LoggerModule } from 'nestjs-pino';
import { trace } from '@opentelemetry/api';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [configuration],
      validate: (env) => envSchema.parse({ ...env, ...process.env }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{ ttl: 60000, limit: 30 }],

        storage: new ThrottlerStorageRedisService({
          username: config.get<string>('REDIS_USERNAME'),
          password: config.get<string>('REDIS_PASSWORD'),
          port: Number(config.get<string>('REDIS_PORT')),
          host: config.get<string>('REDIS_HOST'),
          family: 4,
          tls:
            config.get<string>('REDIS_SSL') === 'true'
              ? { servername: config.get<string>('REDIS_HOST') }
              : undefined,
          retryStrategy: (times: number) => Math.min(times * 50, 2000),
          enableReadyCheck: true,
        }),
      }),
    }),
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'api-agromager',
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        mixin() {
          const spanAtivo = trace.getActiveSpan();
          if (!spanAtivo) return {};

          const { traceId, spanId } = spanAtivo.spanContext();
          return { traceId, spanId };
        },
        transport:
          process.env.NODE_ENV === 'production'
            ? {
                target: 'pino-opentelemetry-transport',
                options: {
                  collectorUrl: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
                  resourceAttributes: {
                    'service.name': 'agromanager-api',
                  },
                  headers: {
                    Authorization:
                      process.env.OTEL_EXPORTER_OTLP_HEADERS?.replace(
                        'Authorization=',
                        '',
                      ),
                  },
                },
              }
            : {
                target: 'pino-pretty',
              },
      },
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
    TerminusModule,
  ],
  controllers: [AppController],
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
