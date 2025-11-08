import { AuthRepository } from './auth.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
}
