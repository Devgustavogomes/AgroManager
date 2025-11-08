import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [redisProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule implements OnModuleDestroy {}
