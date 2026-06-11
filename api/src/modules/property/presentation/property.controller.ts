import { FindBySlugUseCase } from '../application/use-cases/find-property-by-slug';
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
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/shared/types/authenticatedRequest';
import { PropertyOutputDto } from '../application/dtos/output.dto';
import { CreatePropertyDto } from '../application/dtos/create.dto';
import { UpdatePropertyDto } from '../application/dtos/update.dto';
import { CreatePropertyUseCase } from '../application/use-cases/create-property';
import { DeletePropertyUseCase } from '../application/use-cases/delete-property';
import { UpdatePropertyUseCase } from '../application/use-cases/update-property';

@Controller('property')
@UseGuards(AuthGuard)
export class PropertyController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly findBySlugUseCase: FindBySlugUseCase,
    private readonly deletePropertyUseCase: DeletePropertyUseCase,
    private readonly updatePropertyUseCase: UpdatePropertyUseCase,
  ) {}

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PropertyOutputDto })
  @ApiBearerAuth()
  async findById(
    @Param('slug') slug: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.findBySlugUseCase.execute(slug, req.producer.id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyOutputDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePropertyDto,
  ) {
    return await this.createPropertyUseCase.execute(req.producer.id, dto);
  }

  @Patch(':slug')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyOutputDto })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('slug') slug: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePropertyDto,
  ) {
    return await this.updatePropertyUseCase.execute(slug, req.producer.id, dto);
  }

  @Delete(':slug')
  @ApiBearerAuth()
  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Req() req: AuthenticatedRequest, @Param('slug') slug: string) {
    await this.deletePropertyUseCase.execute(slug, req.producer.id);
  }
}
