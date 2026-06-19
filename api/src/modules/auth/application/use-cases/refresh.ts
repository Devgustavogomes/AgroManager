/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthContract } from '../../domain/repositories/auth-repository.contract';
import { TTL_REFRESH_TOKEN } from '../../domain/constants/ttlRefreshToken.constants';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/shared/types/jwtPayload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshUseCase {
  constructor(
    private readonly repository: AuthContract,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException(`Token not found`);
    }

    const refreshTokenPayload: JwtPayload = await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      },
    );

    const registeredRefreshToken = await this.repository.verifyRefreshToken(
      refreshTokenPayload.id,
    );

    if (!registeredRefreshToken || registeredRefreshToken !== refreshToken) {
      throw new UnauthorizedException(`Token not found`);
    }

    const { iat, exp, ...payload } = { ...refreshTokenPayload };

    const accessToken = await this.jwtService.signAsync(payload);

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: '7d',
    });

    await this.repository.registerRefreshToken(
      refreshTokenPayload.id,
      newRefreshToken,
      TTL_REFRESH_TOKEN,
    );

    return {
      accessToken,
      newRefreshToken,
    };
  }
}
