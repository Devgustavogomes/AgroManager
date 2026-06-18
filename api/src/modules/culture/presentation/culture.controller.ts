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
import { CreateCultureUseCase } from '../aplication/use-cases/create-culture';
import { CultureIdParams } from '../aplication/dto/cultureIdParams.dto';
import { IsCultureOwnerUseCase } from '../aplication/use-cases/is-culture-owner';
import { FindByIdCultureUseCase } from '../aplication/use-cases/find-by-id';
import { CultureOutput } from '../aplication/dto/cultureOutput.dto';
import { CreateCultureInput } from '../aplication/dto/createCulture.dto';
import { UpdateCultureInput } from '../aplication/dto/updateCulture.dto';
import { UpdateCultureUseCase } from '../aplication/use-cases/update-culture';
import { DeleteCultureUseCase } from '../aplication/use-cases/delete-culture';
import { IsPropertyOwnerUseCase } from 'src/modules/property/application/use-cases/is-property-owner';

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
    return await this.createCultureUseCase.execute(
      params.slug,
      params.id!,
      dto,
    );
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
