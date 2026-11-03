import { Injectable } from '@nestjs/common';
import { LoginInputDto } from '../dto/login.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/shared/application/types/jwtPayload';
import { TTL_REFRESH_TOKEN } from '../../domain/constants/ttlRefreshToken.constants';
import { AuthContract } from '../../domain/repositories/authRepository.contract';
import { UnauthorizedError } from 'src/shared/domain/errors/unauthorizedError';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly repository: AuthContract,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    data: LoginInputDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const producer = await this.repository.findProducer(data.email);

    if (!producer) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await compare(data.password, producer.hashedPassword);

    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: producer.producerId,
      username: producer.username,
      role: producer.role,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: '7d',
    });

    await this.repository.registerRefreshToken(
      producer.producerId,
      refreshToken,
      TTL_REFRESH_TOKEN,
    );

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
