import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PinoLogger } from 'nestjs-pino';
import { CacheConnectionContract } from './connection.contract';

@Injectable()
export class RedisProvider implements CacheConnectionContract<Redis> {
  private readonly client: Redis;

  constructor(config: ConfigService, logger: PinoLogger) {
    logger.setContext('redis-cache-provider');

    this.client = new Redis({
      username: config.get<string>('redis.REDIS_USERNAME'),
      password: config.get<string>('redis.REDIS_PASSWORD'),
      port: Number(config.get<string>('redis.REDIS_PORT')),
      host: config.get<string>('redis.REDIS_HOST'),
      family: 4,
      tls:
        config.get<string>('redis.REDIS_SSL') === 'true'
          ? { servername: config.get<string>('redis.REDIS_HOST') }
          : undefined,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      enableReadyCheck: true,
    });

    this.client.on('connect', () => logger.info('[Redis-Cache] connected!'));
    this.client.on('ready', () =>
      logger.info('[Redis-Cache] Ready for commands!'),
    );
    this.client.on('error', (err) => logger.error('[Redis-Cache] Error:', err));
    this.client.on('reconnecting', () =>
      logger.warn('[Redis-Cache] Reconnecting...'),
    );
  }

  getClient(): Redis {
    return this.client;
  }
}
