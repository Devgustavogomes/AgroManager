import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import type { findProducerOutput } from './dto/findProducer.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findProducer(CPForCNPJ: string): Promise<findProducerOutput> {
    const sql = `SELECT *
                FROM producers
                WHERE cpf_or_cnpj = $1`;
    const params = [CPForCNPJ];
    const producer = await this.databaseService.query<findProducerOutput>(
      sql,
      params,
    );

    return producer[0];
  }
}
