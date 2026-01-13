import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OwnerGuard } from 'src/authorization/owner.guard';
import { RolesGuards } from 'src/authorization/roles.guard';
import { PropertyService } from './property.service';
import { IdDto } from 'src/types/idParams';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { PropertyOutputDto } from './dto/propertyOutput.dto';
import { OwnerService } from 'src/decorators/owner.decorator';

@Controller('property')
@UseGuards(AuthGuard, RolesGuards, OwnerGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyOutputDto })
  @OwnerService(PropertyService)
  async findById(@Param() params: IdDto) {
    return await this.propertyService.findById(params.id);
  }
}
