import { Injectable } from '@nestjs/common';
import { MigrationProviderContract } from '../../domain/providers/migration.provider.contract';

@Injectable()
export class ExecuteMigrationsUseCase {
  constructor(private readonly migrationProvider: MigrationProviderContract) {}

  async execute(): Promise<void> {
    await this.migrationProvider.executeMigrations();
  }
}
