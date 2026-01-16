import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { producerOutput } from './dto/producerOutput.dto';
import {
  UpdateProducerDTO,
  CreateProducerInput,
} from './dto/producerInput.dto';
import { AuthGuard } from 'src/infra/auth/auth.guard';
import { RolesGuards } from 'src/shared/authorization/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/shared/types/role';
import { OwnerGuard } from 'src/shared/authorization/owner.guard';
import { OwnerService } from 'src/decorators/owner.decorator';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('/producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: producerOutput })
  @UseGuards(AuthGuard, RolesGuards, OwnerGuard)
  async findAll(): Promise<producerOutput[]> {
    const producers = await this.producerService.findAll();

    return producers;
  }

  @Get(':id')
  @OwnerService(ProducerService)
  @UseGuards(AuthGuard, RolesGuards, OwnerGuard)
  @ApiOkResponse({ type: producerOutput })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<producerOutput> {
    const producer = await this.producerService.findOne(id);
    return producer;
  }

  @Post()
  @ApiOkResponse({ type: producerOutput, isArray: true })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    data: CreateProducerInput,
  ): Promise<producerOutput> {
    const producer = await this.producerService.create(data);

    return producer;
  }

  @Patch(':id')
  @ApiOkResponse({ type: producerOutput })
  @OwnerService(ProducerService)
  @UseGuards(AuthGuard, RolesGuards, OwnerGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProducerDTO,
  ): Promise<producerOutput> {
    const producer = await this.producerService.update(id, data);

    return producer;
  }

  @Delete(':id')
  @OwnerService(ProducerService)
  @UseGuards(AuthGuard, RolesGuards, OwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.producerService.remove(id);
  }
}
