import { describe, it, expect } from 'vitest';
import { Producer } from './producer.entity';
import { Role } from 'src/shared/application/types/role';

describe('Producer Entity', () => {
  const validProps = {
    username: 'john_doe',
    email: 'john@example.com',
    hashedPassword: 'hashed_password',
  };

  it('Should create a producer successfully with default values', () => {
    const producer = Producer.create(validProps);

    expect(producer.username).toBe(validProps.username);
    expect(producer.email).toBe(validProps.email);
    expect(producer.hashedPassword).toBe(validProps.hashedPassword);

    expect(producer.role).toBe(Role.USER);
    expect(producer.producerId).toBe('non-registered');
    expect(producer.createdAt).toBeInstanceOf(Date);
    expect(producer.updatedAt).toBeNull();
  });

  it('Should create a producer with provided optional values', () => {
    const customDate = new Date('2023-01-01');
    const producer = Producer.create({
      ...validProps,
      role: Role.ADMIN,
      producerId: 'custom-id',
      createdAt: customDate,
    });

    expect(producer.role).toBe(Role.ADMIN);
    expect(producer.producerId).toBe('custom-id');
    expect(producer.createdAt).toEqual(customDate);
  });

  it('Should emit a producer.created domain event upon creation', () => {
    const producer = Producer.create(validProps);
    const events = producer.getDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('producer.created');
    expect(events[0].data.title).toBe('Produtor cadastrado');
  });

  it('Should update producer fields and touch updatedAt', () => {
    const producer = Producer.create(validProps);
    producer.clearDomainEvents();

    producer.update({
      username: 'jane_doe',
      email: 'jane@example.com',
    });

    expect(producer.username).toBe('jane_doe');
    expect(producer.email).toBe('jane@example.com');
    expect(producer.updatedAt).toBeInstanceOf(Date);

    const events = producer.getDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('producer.updated');
    expect(events[0].data.title).toBe('Dados alterados');
  });

  it('Should reconstitute an existing producer without triggering creation events', () => {
    const props = {
      ...validProps,
      producerId: 'producer-123',
      role: Role.USER,
      createdAt: new Date('2023-01-01'),
      updatedAt: null,
    };

    const producer = Producer.reconstitute(props);

    expect(producer.producerId).toBe('producer-123');
    expect(producer.username).toBe('john_doe');
    expect(producer.getDomainEvents()).toHaveLength(0);
  });
});
