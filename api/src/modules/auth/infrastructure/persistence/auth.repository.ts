import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@agromanager/infra/database/service';
import { ProducerLogin } from '../../domain/entities/producerLogin.entity';
import {
  AuthContract,
  ProducerLoginPersistence,
} from '../../domain/repositories/auth-repository.contract';
import { AuthMapper } from '../auth.mapper';
import { RedisService } from '@agromanager/infra/redis/service';

@Injectable()
export class AuthRepository implements AuthContract {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  async findProducer(email: string): Promise<ProducerLogin> {
    const sql = `SELECT 
                "producerId",
                USERNAME,
                "hashedPassword",
                ROLE
                FROM producers
                WHERE email = $1`;

    const params = [email];

    const producer = await this.databaseService.query<ProducerLoginPersistence>(
      sql,
      params,
    );

    return AuthMapper.toDomain(producer[0]);
  }

  async registerRefreshToken(
    producerId: string,
    refreshToken: string,
    expiresIn: number,
  ): Promise<void> {
    await this.redisService.set(
      `refresh_${producerId}`,
      refreshToken,
      expiresIn,
    );
  }
  async unregisterRefreshToken(producerId: string): Promise<void> {
    await this.redisService.del(`refresh_${producerId}`);
  }

  async verifyRefreshToken(producerId: string): Promise<string | null> {
    return await this.redisService.get(`refresh_${producerId}`);
  }
}
