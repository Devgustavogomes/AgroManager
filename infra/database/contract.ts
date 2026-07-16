import type { PoolClient } from "pg";

export abstract class DatabaseContract {
  abstract transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T>;
  abstract query<T = unknown>(
    sql: string,
    params?: unknown[],
    client?: PoolClient,
  ): Promise<T[]>;
  abstract getClient(): Promise<PoolClient>;
}
