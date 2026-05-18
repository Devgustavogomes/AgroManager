import { Role } from 'src/shared/types/role';
import { CreateProducerInput } from './DTOs/createProducer.dto';
import { ProducerOutput } from './DTOs/producerOutput.dto';
import { UpdateProducerDTO } from './DTOs/updateProducer.dto';
export interface ProducerPersistence {
  id_producer: string;
  username: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: Date;
  updated_at: Date | null;
}
export abstract class ProducerContract {
  abstract findById(id: string): Promise<ProducerOutput | undefined>;
  abstract create(dto: CreateProducerInput): Promise<ProducerOutput>;
  abstract update(id: string, dto: UpdateProducerDTO): Promise<ProducerOutput>;
  abstract remove(id: string): Promise<void>;
}
