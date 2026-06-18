import { ProducerOutput } from '../../application/dtos/output.dto';
import { ProducerPersistence } from '../../domain/repositories/producerRepository.contract';

export class ProducerMapper {
  static toOutput(data: ProducerPersistence[]): ProducerOutput[] {
    return data
      .values()
      .map((r) => ({
        idProducer: r.producerId,
        username: r.username,
        email: r.email,
        role: r.role,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
      }))
      .toArray();
  }
}
