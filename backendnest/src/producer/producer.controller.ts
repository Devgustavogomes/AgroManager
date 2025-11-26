import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { producerOutput } from './dto/producerOutput.dto';
import {
  UpdateProducerDTO,
  CreateProducerInput,
} from './dto/producerInput.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuards } from 'src/authorization/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/role';
import { OwnerGuard } from 'src/authorization/owner.guard';
import { OwnerService } from 'src/decorators/owner.decorator';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('/producers')
@UseGuards(AuthGuard, RolesGuards, OwnerGuard)
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @ApiOkResponse({ type: producerOutput })
  async findAll(): Promise<producerOutput[]> {
    const producers = await this.producerService.findAll();

    return producers;
  }

  @Get(':id')
  @OwnerService(ProducerService)
  @ApiOkResponse({ type: producerOutput })
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<producerOutput> {
    const producer = await this.producerService.findOne(id);
    return producer;
  }

  @Post()
  @ApiOkResponse({ type: producerOutput, isArray: true })
  @HttpCode(201)
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
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProducerDTO,
  ): Promise<producerOutput> {
    const producer = await this.producerService.update(id, data);

    return producer;
  }

  @Delete(':id')
  @OwnerService(ProducerService)
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.producerService.remove(id);
  }
}
