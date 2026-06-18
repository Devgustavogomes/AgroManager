import { Role } from 'src/shared/types/role';
import { ProducerOutput } from '../../application/dtos/output.dto';
import { UpdateProducerDTO } from '../../application/dtos/update.dto';
import { Producer } from '../entities/producer.entity';

export interface ProducerPersistence {
  producerId: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date | null;
}

export abstract class ProducerContract {
  abstract findById(id: string): Promise<ProducerOutput | undefined>;
  abstract create(dto: Producer): Promise<ProducerOutput>;
  abstract update(id: string, dto: UpdateProducerDTO): Promise<ProducerOutput>;
  abstract remove(id: string): Promise<void>;
}
