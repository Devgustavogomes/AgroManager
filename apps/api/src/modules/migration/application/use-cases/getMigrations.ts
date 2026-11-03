import { Injectable } from '@nestjs/common';
import { MigrationProviderContract } from '../../domain/providers/migration.provider.contract';

@Injectable()
export class GetMigrationsUseCase {
  constructor(private readonly migrationProvider: MigrationProviderContract) {}

  async execute(): Promise<unknown[]> {
    return await this.migrationProvider.getMigrations();
  }
}
