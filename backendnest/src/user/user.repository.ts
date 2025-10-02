import { Injectable } from '@nestjs/common';
import {
  changeUserDTO,
  CreateUserDTO,
  UserIdDTO,
  UserOutput,
} from './dto/user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers(): Promise<UserOutput[]> {
    const sql = `SELECT *
                FROM users_table`;
    const users = await this.databaseService.query<UserOutput>(sql);
    return users;
  }
  async getUserById(id: UserIdDTO): Promise<UserOutput[]> {
    const sql = `SELECT *
                FROM users_table
                WHERE id = $1`;
    const params = [`${id.id}`];
    const user = await this.databaseService.query<UserOutput>(sql, params);
    return user;
  }
  async create(data: CreateUserDTO): Promise<UserOutput[]> {
    const { name, email, hashedPassword } = data;
    const sql = '';
    const params = [`${name}`, `${email}`, `${hashedPassword}`];

    const user = this.databaseService.query<UserOutput>(sql, params);

    return user;
  }

  async change(id: UserIdDTO, data: changeUserDTO): Promise<UserOutput[]> {
    const sql = '';
    const params = [];
    const user = await this.databaseService.query<UserOutput>(sql, params);

    return user;
  }

  async delete(id: UserIdDTO): Promise<void> {
    const sql = '';
    const params = [`${id.id}`]; // mudar

    await this.databaseService.query(sql, params);
  }
}
