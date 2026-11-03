import { describe, it, expect } from 'vitest';
import { ProducerLogin } from './producerLogin.entity';
import { Role } from 'src/shared/application/types/role';

describe('ProducerLogin Entity', () => {
  it('Should create a producer login entity successfully', () => {
    const props = {
      producerId: 'producer-123',
      username: 'john_doe',
      hashedPassword: 'hashed_password_123',
      role: Role.USER,
    };

    const producerLogin = ProducerLogin.create(props);

    expect(producerLogin).toBeInstanceOf(ProducerLogin);
    expect(producerLogin.producerId).toBe('producer-123');
    expect(producerLogin.username).toBe('john_doe');
    expect(producerLogin.hashedPassword).toBe('hashed_password_123');
    expect(producerLogin.role).toBe(Role.USER);
  });
});
