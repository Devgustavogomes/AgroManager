import { changeUserDto, createUserDto, idDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.getUsers();

    if (!users) {
      throw new Error('Users not found');
    }

    return users;
  }

  async getUserById(id: idDto): Promise<User> {
    const user = await this.userRepository.getUserById(id);

    return user[0];
  }

  async create(data: createUserDto): Promise<User> {
    const { name, email, password } = data;

    const hashedPassword = await hash(password, 10);

    const parsedUser = {
      name,
      email,
      hashedPassword,
    };

    const user = await this.userRepository.create(parsedUser);

    return user[0];
  }
  async change(id: idDto, data: changeUserDto): Promise<User> {
    const user = await this.userRepository.change(id, data);

    return user[0];
  }

  async delete(id: idDto): Promise<void> {
    await this.userRepository.delete(id);
  }
}
