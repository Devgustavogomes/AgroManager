import { Body, Controller, Post } from '@nestjs/common';

@Controller('login')
export class AuthController {
  constructor(private readonly authService) {}

  @Post()
  async login() {}
}
