import { Global, Module } from '@nestjs/common';
import { DatabaseClientProvider } from './database.provider';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseClientProvider, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
