import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisProvider = {
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const client = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: Number(configService.get<string>('REDIS_PORT')),
      password: configService.get<string>('REDIS_PASSWORD'),
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
