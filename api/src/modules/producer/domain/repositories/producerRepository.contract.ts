import { Role } from 'src/shared/types/role';
import { Producer } from '../entities/producer.entity';

export interface ProducerPersistence {
  producerId: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: Role;
  createdAt: string;
  updatedAt: string | null;
}

export abstract class ProducerContract {
  abstract findById(id: string): Promise<Producer | undefined>;
  abstract create(dto: Producer): Promise<Producer>;
  abstract update(id: string, dto: Producer): Promise<Producer>;
  abstract remove(id: string): Promise<void>;
}
