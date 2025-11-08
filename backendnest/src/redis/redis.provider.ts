import Redis from 'ioredis';

export const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
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
