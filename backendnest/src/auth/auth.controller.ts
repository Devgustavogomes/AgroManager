// import { Body, Controller, Post, UsePipes } from '@nestjs/common';
// import { ZodValidationPipe } from 'src/pipes/validation.pipe';
// import { loginSchema } from './dto/login.dto';
// import type { loginDto } from './dto/login.dto';

// @Controller('login')
// export class AuthController {
//   constructor(private readonly authService) {}

//   @Post()
//   @UsePipes(new ZodValidationPipe(loginSchema))
//   async login(@Body() data: loginDto) {}
// }
