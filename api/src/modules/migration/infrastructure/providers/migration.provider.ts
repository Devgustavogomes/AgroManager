import { Injectable } from '@nestjs/common';
import { runner } from 'node-pg-migrate';
import { join } from 'node:path';
import { PoolClient } from 'pg';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { MigrationProviderContract } from '../../domain/providers/migration.provider.contract';

@Injectable()
export class MigrationProvider implements MigrationProviderContract {
  constructor(private readonly databaseService: DatabaseContract) {}

  async getMigrations(): Promise<unknown[]> {
    let client: PoolClient | undefined;
    try {
      client = await this.databaseService.getClient();
      return await runner({
        dbClient: client,
        direction: 'up',
        dir: join(process.cwd(), '..', 'infra', 'database', 'migrations'),
        dryRun: true,
        migrationsTable: 'pgmigrations',
      });
    } catch (err: unknown) {
      console.error('Migration failed', err);
      throw err;
    } finally {
      client?.release();
    }
  }

  async executeMigrations(): Promise<void> {
    let client: PoolClient | undefined;
    try {
      client = await this.databaseService.getClient();
      await runner({
        dbClient: client,
        direction: 'up',
        dir: join(process.cwd(), '..', 'infra', 'database', 'migrations'),
        dryRun: false,
        migrationsTable: 'pgmigrations',
      });
    } catch (err: unknown) {
      console.error('Migration failed', err);
      throw err;
    } finally {
      client?.release();
    }
  }
}
