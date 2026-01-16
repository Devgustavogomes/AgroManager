import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyRepository } from './property.repository';
import { PropertyService } from './property.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyRepository, PropertyService],
})
export class PropertyModule {}
