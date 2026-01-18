import { Module } from '@nestjs/common';
import { ProducerController } from './controller';
import { ProducerService } from './service';
import { ProducerRepository } from './repository';
import { ProducerContract } from './contract';

@Module({
  controllers: [ProducerController],
  providers: [
    ProducerService,
    { provide: ProducerContract, useClass: ProducerRepository },
  ],
})
export class ProducerModule {}
