import { ProducerLogin } from '../domain/entities/producerLogin.entity';
import { ProducerLoginPersistence } from '../domain/repositories/auth-repository.constract';

export class AuthMapper {
  static toDomain(producer: ProducerLoginPersistence) {
    return ProducerLogin.create({
      producerId: producer.producerId,
      username: producer.username,
      hashedPassword: producer.hashedPassword,
      role: producer.role,
    });
  }
}
