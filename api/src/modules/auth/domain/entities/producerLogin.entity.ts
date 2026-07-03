import { Entity } from 'src/shared/domain/entities/entity';
import { Role } from 'src/shared/application/types/role';

interface ProducerLoginProps {
  producerId: string;
  username: string;
  hashedPassword: string;
  role: Role;
}

export class ProducerLogin extends Entity<ProducerLoginProps> {
  public static create(props: ProducerLoginProps) {
    return new ProducerLogin(props);
  }

  get producerId(): string {
    return this.props.producerId;
  }

  get username(): string {
    return this.props.username;
  }

  get hashedPassword(): string {
    return this.props.hashedPassword;
  }

  get role(): Role {
    return this.props.role;
  }
}
