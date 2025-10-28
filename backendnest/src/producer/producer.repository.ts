import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { producerOutput } from './dto/producerOutput.dto';
import { changeProducerDTO, CreateProducerDTO } from './dto/producerInput.dto';

@Injectable()
export class ProducerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getProducers(): Promise<producerOutput[]> {
    const sql = `SELECT id, username, cpf_or_cnpj, created_at
                FROM producers;`;
    const producers = await this.databaseService.query<producerOutput>(sql);
    return producers;
  }
  async getProducerById(id: string): Promise<producerOutput[]> {
    const sql = `SELECT id, username, cpf_or_cnpj, created_at
                FROM producers
                WHERE id = $1;`;
    const params = [`${id}`];
    const producer = await this.databaseService.query<producerOutput>(
      sql,
      params,
    );
    return producer;
  }
  async create(data: CreateProducerDTO): Promise<producerOutput[]> {
    const { name, hashedPassword, CPForCNPJ } = data;
    const sql = `INSERT INTO producers 
                (username, 
                cpf_or_cnpj, 
                hashed_password)
                VALUES
                ($1,
                $2,
                $3)
                RETURNING id, username, cpf_or_cnpj, role;`;
    const params = [`${name}`, `${CPForCNPJ}`, `${hashedPassword}`];

    const producer = this.databaseService.query<producerOutput>(sql, params);

    return producer;
  }

  async change(id: string, data: changeProducerDTO): Promise<producerOutput[]> {
    const sql = `UPDATE producers
                SET username = $1,
                cpf_or_cnpj = $2
                WHERE id = $3
                RETURNING id, username, cpf_or_cnpj, role;
                `;
    const params = [`${data.name}`, `${data.CPForCNPJ}`, `${id}`];
    const producer = await this.databaseService.query<producerOutput>(
      sql,
      params,
    );

    return producer;
  }

  async delete(id: string): Promise<void> {
    const sql = `DELETE INTO producers
                WHERE id = $1`;
    const params = [`${id}`];

    await this.databaseService.query(sql, params);
  }
}
