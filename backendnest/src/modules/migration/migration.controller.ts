import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { AuthGuard } from 'src/infra/auth/auth.guard';
import { RolesGuards } from 'src/shared/authorization/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/shared/types/role';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('migration')
@UseGuards(AuthGuard, RolesGuards)
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async getMigrations() {
    return await this.migrationService.getMigrations();
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async executeMigrations() {
    await this.migrationService.executeMigrations();
  }
}
