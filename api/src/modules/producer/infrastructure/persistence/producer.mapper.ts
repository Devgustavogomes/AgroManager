import { ProducerOutput } from '../../application/dto/output.dto';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerPersistence } from '../../domain/repositories/producerRepository.contract';

export class ProducerMapper {
  static toDomain(data: ProducerPersistence[]): Producer[] {
    return data
      .values()
      .map((r) =>
        Producer.reconstitute({
          producerId: r.producerId,
          username: r.username,
          email: r.email,
          role: r.role,
          hashedPassword: r.hashedPassword,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      )
      .toArray();
  }
  static toResponse(producer: Producer[]): ProducerOutput[] {
    return producer
      .values()
      .map((r) => ({
        producerId: r.producerId,
        username: r.username,
        email: r.email,
        role: r.role,
        createdAt:
          r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
        updatedAt:
          r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
      }))
      .toArray();
  }
}
