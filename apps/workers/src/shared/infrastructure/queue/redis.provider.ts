import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { QueueConnectionContract } from './queueConnection.contract';
import { Redis } from 'ioredis';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RedisProvider implements QueueConnectionContract<Redis> {
  client: Redis;

  constructor(config: ConfigService, logger: PinoLogger) {
    logger.setContext('Redis-Queue');

    this.client = new Redis({
      username: config.get<string>('queue.QUEUE_USERNAME'),
      password: config.get<string>('queue.QUEUE_PASSWORD'),
      host: config.get<string>('queue.QUEUE_HOST'),
      port: config.get<number>('queue.QUEUE_PORT'),
      family: 4,
      tls:
        config.get<string>('queue.QUEUE_SSL') === 'true'
          ? { servername: config.get<string>('queue.QUEUE_HOST') }
          : undefined,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      enableReadyCheck: true,
    });

    this.client.on('connect', () => logger.info('[Redis-Queue] connected!'));
    this.client.on('ready', () =>
      logger.info('[Redis-Queue] Ready for commands!'),
    );
    this.client.on('error', (err) => logger.error('[Redis-Queue] Error:', err));
    this.client.on('reconnecting', () =>
      logger.warn('[Redis-Queue] Reconnecting...'),
    );
  }

  getClient(): Redis {
    return this.client;
  }
}
