import type { PoolClient } from "pg";

export abstract class DatabaseContract {
  abstract transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T>;
  abstract query<T = any>(
    sql: string,
    params?: any[],
    client?: PoolClient,
  ): Promise<T[]>;
  abstract getClient(): Promise<PoolClient>;
}
