import { Entity } from 'src/shared/domain/entities/entity';
import { Optional } from 'src/shared/application/types/optional';
import { Role } from 'src/shared/application/types/role';

export interface ProducerProps {
  producerId: string;
  username: string;
  email: string;
  role: Role;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class Producer extends Entity<ProducerProps, { username: string }> {
  static create(
    props: Optional<ProducerProps, 'role' | 'createdAt' | 'updatedAt'>,
  ): Producer {
    const producer = new Producer({
      ...props,
      role: props.role ?? Role.USER,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    });

    producer.domainEvents.push({
      event: 'producer.created',
      data: {
        username: producer.username,
      },
    });

    return producer;
  }

  static reconstitute(props: ProducerProps): Producer {
    return new Producer(props);
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

      this.domainEvents.push({
        event: 'producer.updated',
        data: {
          username: this.props.username,
        },
      });
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
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date | null {
    return this.props.updatedAt;
  }
  get producerId(): string {
    return this.props.producerId;
  }
}
