import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { CacheContract } from "./contract";

@Injectable()
export class RedisService implements OnModuleDestroy, CacheContract {
  constructor(@Inject("REDIS_CLIENT") private readonly redis: Redis) {}

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.redis.set(key, value, "EX", ttl);
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
