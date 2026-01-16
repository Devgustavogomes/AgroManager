import { Module } from '@nestjs/common';
import { PropertyController } from './controller';
import { PropertyRepository } from './repository';
import { PropertyService } from './service';
import { PropertyContract } from './contract';

@Module({
  controllers: [PropertyController],
  providers: [
    { provide: PropertyContract, useClass: PropertyRepository },
    PropertyService,
  ],
})
export class PropertyModule {}
