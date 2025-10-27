import { Injectable } from '@nestjs/common';
import { ProducerIdDTO } from './dto/producer.dto';
import { DatabaseService } from 'src/database/database.service';
import { producerOutput } from './dto/producerOutput.dto';
import { changeProducerDTO, CreateProducerDTO } from './dto/producerInput.dto';

@Injectable()
export class ProducerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getProducers(): Promise<producerOutput[]> {
    const sql = `SELECT id, username, CPForCNPJ, created_at
                FROM producers`;
    const producers = await this.databaseService.query<producerOutput>(sql);
    return producers;
  }
  async getProducerById(id: ProducerIdDTO): Promise<producerOutput[]> {
    const sql = `SELECT id, username, CPForCNPJ, created_at
                FROM producers
                WHERE id = $1`;
    const params = [`${id.id}`];
    const producer = await this.databaseService.query<producerOutput>(
      sql,
      params,
    );
    return producer;
  }
  async create(data: CreateProducerDTO): Promise<producerOutput[]> {
    const { name, hashedPassword, CPForCNPJ, role } = data;
    const sql = `INSERT INTO producers 
                (
                username, 
                CPForCNPJ, 
                hashedPassword,
                role
                )
                VALUES
                (
                $1,
                $2,
                $3,
                $4
                )
                RETURNING id, username, CPForCNPJ, role`;
    const params = [`${name}`, `${CPForCNPJ}`, `${hashedPassword}`, `${role}`];

    const producer = this.databaseService.query<producerOutput>(sql, params);

    return producer;
  }

  async change(
    id: ProducerIdDTO,
    data: changeProducerDTO,
  ): Promise<producerOutput[]> {
    const sql = '';
    const params = [`${id.id}`];
    const producer = await this.databaseService.query<producerOutput>(
      sql,
      params,
    );

    return producer;
  }

  async delete(id: ProducerIdDTO): Promise<void> {
    const sql = '';
    const params = [`${id.id}`];

    await this.databaseService.query(sql, params);
  }
}
