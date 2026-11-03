import { Global, Module } from '@nestjs/common';
import { RedisProvider } from './provider';
import { RedisService } from './service';
import { CacheContract } from './contract';
import { CacheConnectionContract } from './connection.contract';

@Global()
@Module({
  providers: [
    { provide: CacheConnectionContract, useClass: RedisProvider },
    { provide: CacheContract, useClass: RedisService },
  ],
  exports: [CacheContract, CacheConnectionContract],
})
export class RedisModule {}
