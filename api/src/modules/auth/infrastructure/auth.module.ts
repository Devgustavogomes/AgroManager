import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthContract } from '../domain/repositories/auth-repository.constract';
import { AuthController } from '../presentation/auth.controller';
import { AuthRepository } from './persistence/auth.repository';
import { LoginUseCase } from '../application/use-cases/login';
import { RefreshUseCase } from '../application/use-cases/refresh';
import { LogoutUseCase } from '../application/use-cases/logout';
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    { provide: AuthContract, useClass: AuthRepository },
  ],
})
export class AuthModule {}
