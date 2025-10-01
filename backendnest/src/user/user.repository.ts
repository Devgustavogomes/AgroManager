import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { changeUserDto, idDto } from './dto/user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers(): Promise<User[]> {
    const sql = `SELECT *
                FROM users_table`;
    const users = await this.databaseService.query<User>(sql);
    return users;
  }
  async getUserById(id: idDto): Promise<User[]> {
    const sql = `SELECT *
                FROM users_table
                WHERE id = $1`;
    const params = [`${id.id}`];
    const user = await this.databaseService.query<User>(sql, params);
    return user;
  }
  async create(data: User): Promise<User[]> {
    const { name, email, hashedPassword } = data;
    const sql = '';
    const params = [`${name}`, `${email}`, `${hashedPassword}`];

    const user = this.databaseService.query<User>(sql, params);

    return user;
  }

  async change(id: idDto, data: changeUserDto): Promise<User[]> {
    const sql = '';
    const params = [];
    const user = await this.databaseService.query<User>(sql, params);

    return user;
  }

  async delete(id: idDto): Promise<void> {
    const sql = '';
    const params = [];

    await this.databaseService.query(sql, params);
  }
}
