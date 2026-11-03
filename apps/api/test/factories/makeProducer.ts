import { randomUUID } from 'node:crypto';
import {
  Producer,
  ProducerProps,
} from 'src/modules/producer/domain/entities/producer.entity';
import { Role } from 'src/shared/application/types/role';

type Override = Partial<ProducerProps>;

export function makeFakeProducer(override: Override = {}) {
  return Producer.create({
    producerId: randomUUID(),
    email: `test-${Date.now().toString()}@gmail.com`,
    hashedPassword: 'Test123#',
    username: `UserTest`,
    role: Role.USER,
    ...override,
  });
}
