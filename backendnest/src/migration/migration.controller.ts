import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuards } from 'src/authorization/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/role';

@Controller('migration')
@UseGuards(AuthGuard, RolesGuards)
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Get()
  @Roles(Role.ADMIN)
  async getMigrations() {
    return await this.migrationService.getMigrations();
  }

  @Post()
  @Roles(Role.ADMIN)
  async executeMigrations() {
    await this.migrationService.executeMigrations();
  }
}
