import { CreateProducerInput, ProducerOutput, UpdateProducerDTO } from './dto';

export abstract class ProducerContract {
  abstract findById(id: string): Promise<ProducerOutput | undefined>;
  abstract create(dto: CreateProducerInput): Promise<ProducerOutput>;
  abstract update(id: string, dto: UpdateProducerDTO): Promise<ProducerOutput>;
  abstract remove(id: string): Promise<void>;
  abstract isOwner(
    idProducer: string,
    _idService: string,
  ): Promise<{ id_producer: string } | undefined>;
}
