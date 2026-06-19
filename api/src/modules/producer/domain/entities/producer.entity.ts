import { Entity } from 'src/shared/domain/entities/entity';
import { Optional } from 'src/shared/types/optional';
import { Role } from 'src/shared/types/role';

export interface ProducerProps {
  producerId: string;
  username: string;
  email: string;
  role: Role;
  hashedPassword: string;
  createdAt: Date | string;
  updatedAt: Date | string | null;
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

  private touch() {
    this.props.updatedAt = new Date();
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  set username(username: string) {
    this.props.username = username;
    this.touch();
  }

  get email(): string {
    return this.props.email;
  }
  get hashedPassword(): string {
    return this.props.hashedPassword;
  }
  get username(): string {
    return this.props.username;
  }
  get role(): Role {
    return this.props.role;
  }
  get createdAt(): Date | string {
    return this.props.createdAt;
  }
  get updatedAt(): Date | string | null {
    return this.props.updatedAt;
  }
  get producerId(): string {
    return this.props.producerId;
  }
}
