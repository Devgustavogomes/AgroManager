import { Injectable } from '@nestjs/common';
import {
  ProducerContract,
  ProducerPersistence,
} from '../../domain/repositories/producerRepository.contract';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerMapper } from './producer.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';

@Injectable()
export class ProducerRepository implements ProducerContract {
  constructor(private readonly databaseService: DatabaseContract) {}

  async findById(id: string): Promise<Producer> {
    const sql = `SELECT
                  *
                FROM producers
                WHERE "producerId" = $1;`;
    const params = [id];

    const producer = await this.databaseService.query<ProducerPersistence>(
      sql,
      params,
    );
    return ProducerMapper.toDomain(producer)[0];
  }

  async create(producer: Producer): Promise<Producer> {
    const sql = `INSERT INTO producers 
                (username, 
                email, 
                "hashedPassword")
                VALUES
                ($1,
                $2,
                $3)
                RETURNING *;`;

    const params = [producer.username, producer.email, producer.hashedPassword];

    const result = await this.databaseService.query<ProducerPersistence>(
      sql,
      params,
    );

    return ProducerMapper.toDomain(result)[0];
  }

  async update(id: string, data: Producer): Promise<Producer> {
    const sql = `UPDATE producers
                SET 
                username = $1,
                email = $2
                WHERE "producerId" = $3
                RETURNING *;
                `;

    const params = [data.username, data.email, id];
    const producer = await this.databaseService.query<ProducerPersistence>(
      sql,
      params,
    );

    return ProducerMapper.toDomain(producer)[0];
  }

  async remove(id: string): Promise<void> {
    const sql = `DELETE FROM producers
                WHERE "producerId" = $1`;
    const params = [id];

    await this.databaseService.query(sql, params);
  }
}
