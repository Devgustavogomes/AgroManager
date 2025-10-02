import { changeUserDTO, UserDTO, UserIdDTO, UserOutput } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(): Promise<UserOutput[]> {
    const users = await this.userRepository.getUsers();

    if (!users) {
      throw new Error('Users not found');
    }

    return users;
  }

  async getUserById(id: UserIdDTO): Promise<UserOutput> {
    const user = await this.userRepository.getUserById(id);

    return user[0];
  }

  async create(data: UserDTO): Promise<UserOutput> {
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
  async change(id: UserIdDTO, data: changeUserDTO): Promise<UserOutput> {
    const cleanData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );

    const user = await this.userRepository.change(id, cleanData);

    return user[0];
  }

  async delete(id: UserIdDTO): Promise<void> {
    await this.userRepository.delete(id);
  }
}
