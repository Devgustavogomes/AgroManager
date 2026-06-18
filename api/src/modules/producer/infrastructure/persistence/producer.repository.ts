import { Injectable } from '@nestjs/common';
import {
  ProducerContract,
  ProducerPersistence,
} from '../../domain/repositories/producerRepository.contract';

import { Producer } from '../../domain/entities/producer.entity';
import { ProducerMapper } from './producer.mapper';
import { ProducerOutput } from '../../application/dtos/output.dto';
import { UpdateProducerDTO } from '../../application/dtos/update.dto';
import { DatabaseService } from '@agromanager/infra/database/service';

@Injectable()
export class ProducerRepository implements ProducerContract {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: string): Promise<ProducerOutput | undefined> {
    const sql = `SELECT
                  *
                FROM producers
                WHERE "producerId" = $1;`;
    const params = [id];

    const producer = await this.databaseService.query<ProducerPersistence>(
      sql,
      params,
    );
    return ProducerMapper.toOutput(producer)[0];
  }

  async create(producer: Producer): Promise<ProducerOutput> {
    const sql = `INSERT INTO producers 
                (username, 
                email, 
                "hashedPassword")
                VALUES
                ($1,
                $2,
                $3)
                RETURNING *;`;

    const params = [
      producer.getUsername(),
      producer.getEmail(),
      producer.getPassword(),
    ];

    const result = await this.databaseService.query<ProducerPersistence>(
      sql,
      params,
    );

    return ProducerMapper.toOutput(result)[0];
  }

  async update(id: string, data: UpdateProducerDTO): Promise<ProducerOutput> {
    const sql = `UPDATE producers
                SET 
                username = COALESCE($1, username),
                email = COALESCE($2, email)
                WHERE "producerId" = $3
                RETURNING *;
                `;

    const params = [data.username, data.email, id];
    const producer = await this.databaseService.query<ProducerPersistence>(
      sql,
      params,
    );

    return ProducerMapper.toOutput(producer)[0];
  }

  async remove(id: string): Promise<void> {
    const sql = `DELETE FROM producers
                WHERE "producerId" = $1`;
    const params = [id];

    await this.databaseService.query(sql, params);
  }
}
