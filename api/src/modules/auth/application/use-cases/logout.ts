import { Injectable } from '@nestjs/common';
import { AuthContract } from '../../domain/repositories/authRepository.contract';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly repository: AuthContract) {}

  async execute(producerId: string) {
    await this.repository.unregisterRefreshToken(producerId);
  }
}
