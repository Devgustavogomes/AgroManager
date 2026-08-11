import { randomUUID } from 'crypto';
import {
  ProducerLogin,
  ProducerLoginProps,
} from '../../src/modules/auth/domain/entities/producerLogin.entity';
import { Role } from '../../src/shared/application/types/role';

type Override = Partial<ProducerLoginProps>;

export function makeFakeProducerLogin(override: Override = {}) {
  return ProducerLogin.create({
    producerId: randomUUID(),
    username: 'fake_producer',
    hashedPassword: 'hashed_password_123',
    role: Role.USER,
    ...override,
  });
}
