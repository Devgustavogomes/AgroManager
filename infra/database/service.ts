/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Injectable,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Pool } from "pg";
import type { PoolClient } from "pg";
import { DatabaseContract } from "./contract";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
@Injectable()
export class DatabaseService
  implements OnModuleDestroy, OnModuleInit, DatabaseContract
{
  constructor(
    @Inject("DATABASE_CLIENT") private readonly pool: Pool,
    @InjectPinoLogger(DatabaseService.name) private readonly logger: PinoLogger,
  ) {}

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      client.release();
      this.logger.info("[Database] connected!");
    } catch (err) {
      this.logger.error(err, "[Database] connection failed");
      throw err;
    }
  }
  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T = unknown>(
    sql: string,
    params?: unknown[],
    client?: PoolClient,
  ): Promise<T[]> {
    const exec = client || this.pool;
    const result = await exec.query(sql, params);
    return result.rows;
  }

  async getClient(): Promise<PoolClient> {
    const client = await this.pool.connect();
    return client;
  }

  async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const result = await fn(client);

      await client.query("COMMIT");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");

      throw error;
    } finally {
      client.release();
    }
  }
}
