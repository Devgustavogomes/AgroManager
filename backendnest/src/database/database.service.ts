/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy, OnModuleInit {
  constructor(@Inject('DATABASE_CLIENT') private readonly pool: Pool) {}

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      client.release();
      console.log('Connected to database');
    } catch (err) {
      console.error('Database connection failed', err);
      throw err;
    }
  }
  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }
}
