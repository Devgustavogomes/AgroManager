import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisProvider = {
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const client = new Redis({
      username: configService.get<string>('REDIS_USERNAME'),
      password: configService.get<string>('REDIS_PASSWORD'),
      port: Number(configService.get<string>('REDIS_PORT')),
      host: configService.get<string>('REDIS_HOST'),
      tls: process.env.NODE_ENV === 'production' ? {} : undefined,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      enableReadyCheck: true,
    });

    client.on('connect', () => console.log('[Redis] connected!'));
    client.on('ready', () => console.log('[Redis] Ready for commands!'));
    client.on('error', (err) => console.error('[Redis] Error:', err));
    client.on('reconnecting', () => console.log('[Redis] Reconnecting...'));

    return client;
  },
};
