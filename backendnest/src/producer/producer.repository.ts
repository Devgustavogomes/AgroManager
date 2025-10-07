import { Injectable } from '@nestjs/common';
import { ProducerIdDTO } from './dto/producer.dto';
import { DatabaseService } from 'src/database/database.service';
import { producerOutput } from './dto/producerOutput.dto';
import { changeProducerDTO, CreateProducerDTO } from './dto/producerInput.dto';

@Injectable()
export class ProducerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getProducers(): Promise<producerOutput[]> {
    const sql = `SELECT *
                FROM users_table`;
    const producers = await this.databaseService.query<producerOutput>(sql);
    return producers;
  }
  async getProducerById(id: ProducerIdDTO): Promise<producerOutput[]> {
    const sql = `SELECT *
                FROM users_table
                WHERE id = $1`;
    const params = [`${id.id}`];
    const user = await this.databaseService.query<producerOutput>(sql, params);
    return user;
  }
  async create(data: CreateProducerDTO): Promise<producerOutput[]> {
    const { name, hashedPassword } = data;
    const sql = '';
    const params = [`${name}`, `${hashedPassword}`];

    const user = this.databaseService.query<producerOutput>(sql, params);

    return user;
  }

  async change(
    id: ProducerIdDTO,
    data: changeProducerDTO,
  ): Promise<producerOutput[]> {
    const sql = '';
    const params = [`${id.id}`];
    const user = await this.databaseService.query<producerOutput>(sql, params);

    return user;
  }

  async delete(id: ProducerIdDTO): Promise<void> {
    const sql = '';
    const params = [`${id.id}`];

    await this.databaseService.query(sql, params);
  }
}
