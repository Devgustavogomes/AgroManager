import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { producerOutput } from './dto/producerOutput.dto';
import {
  UpdateProducerDTO,
  CreateProducerInput,
} from './dto/producerInput.dto';

@Injectable()
export class ProducerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<producerOutput[]> {
    const sql = `SELECT id_producer, username, cpf_or_cnpj,role, created_at, updated_at
                FROM producers;`;
    const producers = await this.databaseService.query<producerOutput>(sql);
    return producers;
  }
  async findOne(id: string): Promise<producerOutput> {
    const sql = `SELECT id_producer, username, cpf_or_cnpj,role, created_at, updated_at
                FROM producers
                WHERE id_producer = $1;`;
    const params = [id];

    const producer = await this.databaseService.query<producerOutput>(
      sql,
      params,
    );
    return producer[0];
  }
  async create(data: CreateProducerInput): Promise<producerOutput> {
    const { username, password, cpf_or_cnpj } = data;
    const sql = `INSERT INTO producers 
                (username, 
                cpf_or_cnpj, 
                hashed_password)
                VALUES
                ($1,
                $2,
                $3)
                RETURNING id_producer, username, cpf_or_cnpj,role, created_at, updated_at;`;
    const params = [username, cpf_or_cnpj, password];

    const producer = await this.databaseService.query<producerOutput>(
      sql,
      params,
    );

    return producer[0];
  }

  async update(id: string, data: UpdateProducerDTO): Promise<producerOutput> {
    const sql = `UPDATE producers
                SET 
                username = COALESCE($1, username),
                cpf_or_cnpj = COALESCE($2, cpf_or_cnpj)
                WHERE id_producer = $3
                RETURNING id_producer, username, cpf_or_cnpj,role, created_at, updated_at;
                `;
    const params = [data.username, data.cpf_or_cnpj, id];
    const producer = await this.databaseService.query<producerOutput>(
      sql,
      params,
    );

    return producer[0];
  }

  async remove(id: string): Promise<void> {
    const sql = `DELETE FROM producers
                WHERE id_producer = $1`;
    const params = [id];

    await this.databaseService.query(sql, params);
  }

  async findOwner(id: string): Promise<{ id_producer: string }> {
    const sql = `SELECT id_producer FROM producers
                  WHERE id_producer = $1`;

    const params = [id];

    const result = await this.databaseService.query<{ id_producer: string }>(
      sql,
      params,
    );

    return result[0];
  }
}
