import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { OwnerService } from 'src/shared/decorators/owner.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { OwnerGuard } from 'src/shared/guards/owner.guard';
import { RolesGuards } from 'src/shared/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CropOutput } from '../application/dto/cropOutput.dto';
import { IdCropDto } from '../application/dto/idCrop.dto';
import { CreateCropInput } from '../application/dto/createCrop.dto';
import { IsCultureOwnerUseCase } from 'src/modules/culture/application/use-cases/isCultureOwner';
import { CreateCropUseCase } from '../application/use-cases/createCrop';
import { DeleteCropByIdUseCase } from '../application/use-cases/deleteCropById';
import { UpdateCropUseCase } from '../application/use-cases/updateCrop';
import { FindCropByIdUseCase } from '../application/use-cases/findCropById';
import { FindCropByCultureUseCase } from '../application/use-cases/findCropByCulture';
import { DeleteCropByCultureUseCase } from '../application/use-cases/deleteCropByCulture';
import { UpdateCropInput } from '../application/dto/updateCrop.dto';
import { IsCropOwnerUseCase } from '../application/use-cases/isCropOwner';

@Controller(':cultureId/crop')
@UseGuards(AuthGuard, RolesGuards, OwnerGuard)
export class CropController {
  constructor(
    private readonly createCropUseCase: CreateCropUseCase,
    private readonly deleteCropByIdUseCase: DeleteCropByIdUseCase,
    private readonly deleteCropByCultureUseCase: DeleteCropByCultureUseCase,
    private readonly findByIdCropUseCase: FindCropByIdUseCase,
    private readonly findByCultureCropUseCase: FindCropByCultureUseCase,
    private readonly updateCropUseCase: UpdateCropUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CropOutput })
  @Post('')
  @OwnerService(IsCultureOwnerUseCase, 'cultureId')
  async create(@Param() params: IdCropDto, @Body() dto: CreateCropInput) {
    return this.createCropUseCase.execute(params.cultureId, dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CropOutput })
  @Get(':id')
  @OwnerService(IsCropOwnerUseCase)
  async findById(@Param() params: IdCropDto) {
    return this.findByIdCropUseCase.execute(params.id!);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CropOutput, isArray: true })
  @Get('')
  @OwnerService(IsCropOwnerUseCase)
  async findByCulture(@Param() params: IdCropDto) {
    return this.findByCultureCropUseCase.execute(params.id!);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CropOutput })
  @Patch(':id')
  @OwnerService(IsCropOwnerUseCase)
  async update(@Param() params: IdCropDto, @Body() dto: UpdateCropInput) {
    return this.updateCropUseCase.execute(params.id!, params.cultureId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @Delete(':id')
  @OwnerService(IsCropOwnerUseCase)
  async deleteById(@Param() params: IdCropDto) {
    return this.deleteCropByIdUseCase.execute(params.id!);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @Delete('')
  @OwnerService(IsCropOwnerUseCase, 'cultureId')
  async deleteByCulture(@Param() params: IdCropDto) {
    return this.deleteCropByCultureUseCase.execute(params.cultureId);
  }
}
