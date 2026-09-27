import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheContract } from './contract';
import { CacheConnectionContract } from './connection.contract';

@Injectable()
export class RedisService implements OnModuleDestroy, CacheContract {
  private readonly redis: Redis;

  constructor(connection: CacheConnectionContract<Redis>) {
    this.redis = connection.getClient();
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
