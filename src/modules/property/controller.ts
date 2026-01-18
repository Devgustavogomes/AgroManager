import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { OwnerGuard } from 'src/shared/guards/owner.guard';
import { RolesGuards } from 'src/shared/guards/roles.guard';
import { PropertyService } from './service';
import { IdDto } from 'src/shared/types/idParams';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { PropertyOutputDto } from './dto';
import { OwnerService } from 'src/shared/decorators/owner.decorator';
import type { AuthenticatedRequest } from 'src/shared/types/authenticatedRequest';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';

@Controller('property')
@UseGuards(AuthGuard, RolesGuards, OwnerGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyOutputDto })
  @HttpCode(HttpStatus.OK)
  @OwnerService(PropertyService)
  async findById(@Param() params: IdDto) {
    return await this.propertyService.findById(params.id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyOutputDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePropertyDto,
  ) {
    return await this.propertyService.create(req.producer.id, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyOutputDto })
  @HttpCode(HttpStatus.OK)
  @OwnerService(PropertyService)
  async update(@Param() params: IdDto, @Body() dto: UpdatePropertyDto) {
    return await this.propertyService.update(params.id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @OwnerService(PropertyService)
  async delete(@Param() params: IdDto) {
    await this.propertyService.delete(params.id);
  }
}
