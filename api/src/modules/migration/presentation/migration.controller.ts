import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/infrastructure/guards/auth.guard';
import { RolesGuards } from 'src/shared/infrastructure/guards/roles.guard';
import { Roles } from 'src/shared/infrastructure/decorators/roles.decorator';
import { Role } from 'src/shared/application/types/role';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetMigrationsUseCase } from '../application/use-cases/getMigrations';
import { ExecuteMigrationsUseCase } from '../application/use-cases/executeMigration';

@Controller('migration')
@UseGuards(AuthGuard, RolesGuards)
export class MigrationController {
  constructor(
    private readonly getMigrationsUseCase: GetMigrationsUseCase,
    private readonly executeMigrationsUseCase: ExecuteMigrationsUseCase,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async getMigrations() {
    return await this.getMigrationsUseCase.execute();
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async executeMigrations() {
    await this.executeMigrationsUseCase.execute();
  }
}
