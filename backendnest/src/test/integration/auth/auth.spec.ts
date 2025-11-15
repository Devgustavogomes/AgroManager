import { Test } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthService } from 'src/auth/auth.service';

let authController: AuthController;
let authService: AuthService;
let authRepository: AuthRepository;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
  }).compile();

  authController = moduleRef.get(AuthController);
  authService = moduleRef.get(AuthService);
  authRepository = moduleRef.get(AuthRepository);
});
