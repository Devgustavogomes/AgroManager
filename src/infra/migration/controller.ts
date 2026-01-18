import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MigrationService } from './service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuards } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
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
