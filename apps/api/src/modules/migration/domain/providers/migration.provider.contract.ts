export abstract class MigrationProviderContract {
  abstract getMigrations(): Promise<unknown[]>;
  abstract executeMigrations(): Promise<void>;
}
