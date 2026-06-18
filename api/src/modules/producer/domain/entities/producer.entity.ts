import { Entity } from 'src/shared/domain/entities/entity';
import { Optional } from 'src/shared/types/optional';
import { Role } from 'src/shared/types/role';

export interface ProducerProps {
  producerId: string;
  username: string;
  email: string;
  role: Role;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class Producer extends Entity<ProducerProps> {
  static create(
    props: Optional<
      ProducerProps,
      'role' | 'createdAt' | 'updatedAt' | 'producerId'
    >,
  ): Producer {
    return new Producer({
      ...props,
      role: props.role ?? Role.USER,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
      producerId: props.producerId ?? 'non-registered',
    });
  }

  getEmail(): string {
    return this.props.email;
  }
  getPassword(): string {
    return this.props.hashedPassword;
  }
  getUsername(): string {
    return this.props.username;
  }
}
