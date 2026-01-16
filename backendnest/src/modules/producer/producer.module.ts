import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { ProducerRepository } from './producer.repository';

@Module({
  controllers: [ProducerController],
  providers: [ProducerService, ProducerRepository],
})
export class ProducerModule {}
