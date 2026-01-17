import { Module } from '@nestjs/common';
import { MigrationController } from './controller';
import { MigrationService } from './service';

@Module({
  controllers: [MigrationController],
  providers: [MigrationService],
})
export class MigrationModule {}
