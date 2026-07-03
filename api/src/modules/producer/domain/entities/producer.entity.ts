import { Entity } from 'src/shared/domain/entities/entity';
import { Optional } from 'src/shared/application/types/optional';
import { Role } from 'src/shared/application/types/role';

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

  update(props: Partial<Pick<ProducerProps, 'email' | 'username'>>) {
    let updated = false;

    if (props.email !== undefined) {
      this.props.email = props.email;
      updated = true;
    }

    if (props.username !== undefined) {
      this.props.username = props.username;
      updated = true;
    }

    if (updated) {
      this.touch();
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
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
