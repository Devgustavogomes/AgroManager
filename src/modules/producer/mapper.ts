import { ProducerPersistence } from './contract';
import { ProducerOutput } from './dto';

export function producerMapper(data: ProducerPersistence[]): ProducerOutput[] {
  return data
    .values()
    .map((r) => ({
      idProducer: r.id_producer,
      username: r.username,
      email: r.email,
      role: r.role,
      createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at ? r.updated_at.toISOString() : null,
    }))
    .toArray();
}
