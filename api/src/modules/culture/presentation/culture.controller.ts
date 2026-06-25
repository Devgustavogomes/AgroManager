import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuards } from 'src/shared/guards/roles.guard';
import { OwnerGuard } from 'src/shared/guards/owner.guard';
import { OwnerService } from 'src/shared/decorators/owner.decorator';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreateCultureUseCase } from '../application/use-cases/createCulture';
import { CultureIdParams } from '../application/dto/cultureIdParams.dto';
import { IsCultureOwnerUseCase } from '../application/use-cases/isCultureOwner';
import { FindByIdCultureUseCase } from '../application/use-cases/findById';
import { CultureOutput } from '../application/dto/cultureOutput.dto';
import { CreateCultureInput } from '../application/dto/createCulture.dto';
import { UpdateCultureInput } from '../application/dto/updateCulture.dto';
import { UpdateCultureUseCase } from '../application/use-cases/updateCulture';
import { DeleteCultureUseCase } from '../application/use-cases/deleteCulture';
import { IsPropertyOwnerUseCase } from 'src/modules/property/application/use-cases/isPropertyOwner';

@Controller(':slug/cultures')
@UseGuards(AuthGuard, RolesGuards, OwnerGuard)
export class CultureController {
  constructor(
    private readonly createCultureUseCase: CreateCultureUseCase,
    private readonly findByIdCultureUseCase: FindByIdCultureUseCase,
    private readonly updateCultureUseCase: UpdateCultureUseCase,
    private readonly deleteCultureUseCase: DeleteCultureUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: CultureOutput })
  @Get(':id')
  @OwnerService(IsCultureOwnerUseCase)
  async findById(@Param() params: CultureIdParams) {
    return await this.findByIdCultureUseCase.execute(params.id!);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CultureOutput })
  @Post()
  @OwnerService(IsPropertyOwnerUseCase, 'slug')
  async create(
    @Param() params: CultureIdParams,
    @Body() dto: CreateCultureInput,
  ) {
    return await this.createCultureUseCase.execute(params.slug, dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CultureOutput })
  @Patch(':id')
  @OwnerService(IsCultureOwnerUseCase)
  async update(
    @Param() params: CultureIdParams,
    @Body() dto: UpdateCultureInput,
  ) {
    return await this.updateCultureUseCase.execute(params.id!, dto);
  }

  @ApiBearerAuth()
  @Delete()
  @OwnerService(IsCultureOwnerUseCase)
  async delete(@Param() params: CultureIdParams) {
    return await this.deleteCultureUseCase.execute(params.id!);
  }
}
