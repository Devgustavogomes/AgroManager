import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginInputDto } from './dto/login.dto';
import { compare } from 'bcryptjs';
import { RedisService } from 'src/redis/redis.service';
import { AuthenticatedRequest } from 'src/types/authenticatedRequest';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(
    data: loginInputDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const producer = await this.authRepository.findProducer(data.CPForCNPJ);

    if (!producer) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await compare(data.password, producer.hashed_password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    try {
      const payload = {
        id: producer.id,
        username: producer.username,
        role: producer.role,
        CPForCNPJ: producer.cpf_or_cnpj,
      };

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_SECRET,
        expiresIn: '7d',
      });

      await this.redisService.set(
        `refresh_${producer.id}`,
        refreshToken,
        604800,
      );

      return {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async logout(producer: AuthenticatedRequest['producer']) {
    await this.redisService.del(`refresh_${producer.id}`);
  }

  async refresh(
    req: AuthenticatedRequest,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const refreshTokenPayload: AuthenticatedRequest['producer'] =
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

    const isInRedis = await this.redisService.get(
      `refresh_${refreshTokenPayload.id}`,
    );

    if (!isInRedis) {
      throw new UnauthorizedException();
    }

    const payload = { ...refreshTokenPayload };

    const accessToken = await this.jwtService.signAsync(payload);

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.redisService.set(
      `refresh_${refreshTokenPayload.id}`,
      newRefreshToken,
      604800,
    );

    return {
      accessToken,
      newRefreshToken,
    };
  }
}
