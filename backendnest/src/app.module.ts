import { Module } from '@nestjs/common';
import { ProducerModule } from './producer/producer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { envSchema } from './config/dto/env.dto';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MigrationModule } from './migration/migration.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
