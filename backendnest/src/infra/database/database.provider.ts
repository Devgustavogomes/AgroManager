import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

interface IEnv {
  database: {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
  };
}

export const DatabaseClientProvider = {
  provide: 'DATABASE_CLIENT',
  useFactory: (configService: ConfigService) => {
    const dbConfig = configService.get<IEnv['database']>('database');
    if (!dbConfig) {
      throw new Error('Database configuration is empty');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new Pool({
      user: dbConfig.user,
      password: dbConfig.password,
      host: dbConfig.host,
      port: dbConfig.port,
      ssl: process.env.NODE_ENV === 'production' ? true : false,
      database: dbConfig.database,
      max: 1000,
      idleTimeoutMillis: 80000,
      connectionTimeoutMillis: 10000,
    });
  },
  inject: [ConfigService],
};
