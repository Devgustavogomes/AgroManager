import { Module } from '@nestjs/common';
import { QueueConnectionContract } from './queueConnection.contract';
import { RedisProvider } from './redis.provider';

@Module({
  providers: [{ useClass: RedisProvider, provide: QueueConnectionContract }],
})
export class QueueConnectionModule {}
