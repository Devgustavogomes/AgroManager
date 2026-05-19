/* eslint-disable @typescript-eslint/require-await */
import { ProducerContract } from '../../../domain/repositories/producer.repository.interface';
import { ProducerEntity } from '../../../domain/entities/producer.entity';
import { Role } from 'src/shared/types/role';
import { ProducerMapper } from '../producer.mapper';
import { ProducerOutput } from 'src/modules/producer/application/dtos/output.dto';
import { UpdateProducerDTO } from 'src/modules/producer/application/dtos/update.dto';

export class InMemoryProducerRepository implements ProducerContract {
  public items: Array<{
    id_producer: string;
    username: string;
    email: string;
    password_hash: string;
    role: Role;
    created_at: Date;
    updated_at: Date | null;
  }> = [];

  async findById(id: string): Promise<ProducerOutput | undefined> {
    const producer = this.items.find((item) => item.id_producer === id);
    if (!producer) return undefined;

    return ProducerMapper.toOutput([producer])[0];
  }

  async create(producer: ProducerEntity): Promise<ProducerOutput> {
    const newProducer = {
      id_producer: Math.random().toString(36).substring(7),
      username: producer.getUsername(),
      email: producer.getEmail(),
      password_hash: producer.getPassword(),
      role: Role.USER,
      created_at: new Date(),
      updated_at: null,
    };

    this.items.push(newProducer);

    return ProducerMapper.toOutput([newProducer])[0];
  }

  async update(id: string, data: UpdateProducerDTO): Promise<ProducerOutput> {
    const index = this.items.findIndex((item) => item.id_producer === id);
    if (index === -1) {
      throw new Error('Producer not found');
    }

    const current = this.items[index];
    const updated = {
      ...current,
      username: data.username ?? current.username,
      email: data.email ?? current.email,
      updated_at: new Date(),
    };

    this.items[index] = updated;

    return ProducerMapper.toOutput([updated])[0];
  }

  async remove(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id_producer === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
