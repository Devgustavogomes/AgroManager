/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Global,
  Module,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { DatabaseClientProvider } from './database.provider';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseClientProvider, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('DATABASE_CLIENT') private readonly pool: Pool) {}

  async onModuleInit() {
    try {
      await this.pool.query('SELECT NOW()');
      console.log('Connect to Database');
    } catch (error) {
      console.log(error);
      throw new Error('Failed to connect to db');
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
