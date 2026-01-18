import { Global, Module } from '@nestjs/common';
import { redisProvider } from './provider';
import { RedisService } from './service';

@Global()
@Module({
  providers: [redisProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
