import { Module } from '@nestjs/common';
import { MigrationController } from '../presentation/migration.controller';
import { MigrationProviderContract } from '../domain/providers/migration.provider.contract';
import { MigrationProvider } from './providers/migration.provider';
import { GetMigrationsUseCase } from '../application/use-cases/getMigrations';
import { ExecuteMigrationsUseCase } from '../application/use-cases/executeMigration';

@Module({
  controllers: [MigrationController],
  providers: [
    GetMigrationsUseCase,
    ExecuteMigrationsUseCase,
    { provide: MigrationProviderContract, useClass: MigrationProvider },
  ],
})
export class MigrationModule {}
