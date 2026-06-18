import { Entity } from 'src/shared/domain/entities/entity';
import { Optional } from 'src/shared/types/optional';
import { Role } from 'src/shared/types/role';

export interface ProducerProps {
  id_producer?: string;
  username: string;
  email: string;
  role: Role;
  password_hash: string;
  created_at: Date;
  updated_at: Date | null;
}

export class Producer extends Entity<ProducerProps> {
  static create(
    props: Optional<ProducerProps, 'role' | 'created_at' | 'updated_at'>,
  ): Producer {
    return new Producer({
      ...props,
      role: Role.USER,
      created_at: new Date(),
      updated_at: null,
    });
  }

  getEmail(): string {
    return this.props.email;
  }
  getPassword(): string {
    return this.props.password_hash;
  }
  getUsername(): string {
    return this.props.username;
  }
}
