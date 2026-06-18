import { Role } from 'src/shared/types/role';
import { ProducerOutput } from '../../application/dtos/output.dto';
import { UpdateProducerDTO } from '../../application/dtos/update.dto';
import { Producer } from '../entities/producer.entity';

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
  abstract create(dto: Producer): Promise<ProducerOutput>;
  abstract update(id: string, dto: UpdateProducerDTO): Promise<ProducerOutput>;
  abstract remove(id: string): Promise<void>;
}
