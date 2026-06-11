import { Global, Module } from '@nestjs/common';
import { DatabaseClientProvider } from './provider';
import { DatabaseService } from './service';

@Global()
@Module({
  providers: [DatabaseClientProvider, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
