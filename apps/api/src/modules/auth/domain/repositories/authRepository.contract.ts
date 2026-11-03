import { Role } from 'src/shared/application/types/role';
import { ProducerLogin } from '../entities/producerLogin.entity';

export interface ProducerLoginPersistence {
  producerId: string;
  username: string;
  hashedPassword: string;
  role: Role;
}

export abstract class AuthContract {
  abstract findProducer(email: string): Promise<ProducerLogin | null>;
  abstract registerRefreshToken(
    producerId: string,
    refreshToken: string,
    expiresIn: number,
  ): Promise<void>;
  abstract unregisterRefreshToken(producerId: string): Promise<void>;
  abstract verifyRefreshToken(producerId: string): Promise<string | null>;
}
