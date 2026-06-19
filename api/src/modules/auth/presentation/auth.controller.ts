import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import type { AuthenticatedRequest } from 'src/shared/types/authenticatedRequest';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LoginInputDto } from '../application/dto/login.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { LoginUseCase } from '../application/use-cases/login';
import { RefreshUseCase } from '../application/use-cases/refresh';
import { LogoutUseCase } from '../application/use-cases/logout';
import { TTL_REFRESH_TOKEN } from '../domain/constants/ttlRefreshToken.constants';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  async login(
    @Body() data: LoginInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.loginUseCase.execute(data);

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: TTL_REFRESH_TOKEN,
    });

    return { accessToken: tokens.accessToken };
  }

  @Post('refresh')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiBearerAuth()
  async refresh(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = req.cookies as Record<string, string> | undefined;
    const refreshToken = cookies?.['refresh_token'] ?? '';

    const tokens = await this.refreshUseCase.execute(refreshToken);

    res.cookie('refresh_token', tokens.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: TTL_REFRESH_TOKEN,
    });

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.logoutUseCase.execute(req.producer.id);

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return { message: 'Logout done successfully' };
  }
}
