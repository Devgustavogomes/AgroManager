import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infra/database/service';

interface findProducerOutput {
  id_producer: string;
  username: string;
  password_hash: string;
  role: string;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findProducer(email: string): Promise<findProducerOutput> {
    const sql = `SELECT 
                ID_PRODUCER,
                USERNAME,
                PASSWORD_HASH,
                ROLE
                FROM producers
                WHERE email = $1`;
    const params = [email];
    const producer = await this.databaseService.query<findProducerOutput>(
      sql,
      params,
    );

    return producer[0];
  }
}
