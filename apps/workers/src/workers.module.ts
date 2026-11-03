import { Redis } from 'ioredis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueConnectionModule } from './shared/infrastructure/queue/queueConnection.module';
import { QueueConnectionContract } from './shared/infrastructure/queue/queueConnection.contract';
import configuration from './shared/config/env/configuration';
import { envSchema } from './shared/config/env/env.dto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [configuration],
      validate: (env) => envSchema.parse({ ...env, ...process.env }),
    }),
    BullModule.forRootAsync({
      imports: [QueueConnectionModule],
      inject: [QueueConnectionContract],
      useFactory: (provider: QueueConnectionContract<Redis>) => ({
        connection: provider.getClient(),
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 3000, jitter: 50 },
          removeOnComplete: true,
        },
      }),
    }),
    QueueConnectionModule,
  ],
})
export class WorkersModule {}
