import { User } from './interfaces/user.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { changeUserSchema, createUserSchema, idSchema } from './dto/user.dto';
import type { changeUserDto, createUserDto, idDto } from './dto/user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  async getUsers(): Promise<User[]> {
    const users = await this.userService.getUsers();

    return users;
  }

  @Get(':id')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(idSchema))
  async getUserById(@Param('id') id: idDto): Promise<User> {
    const user = await this.userService.getUserById(id);
    return user;
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() data: createUserDto): Promise<User> {
    const user = await this.userService.create(data);

    return user;
  }

  @Put(':id')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(changeUserSchema))
  async change(
    @Param('id') id: idDto,
    @Body() data: changeUserDto,
  ): Promise<User> {
    const user = await this.userService.change(id, data);

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(idSchema))
  async delete(@Param('id') id: idDto): Promise<void> {
    await this.userService.delete(id);
  }
}
