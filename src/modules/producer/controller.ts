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
import { ProducerService } from './service';
import { UpdateProducerDTO, CreateProducerInput, ProducerOutput } from './dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuards } from 'src/shared/guards/roles.guard';
import { OwnerGuard } from 'src/shared/guards/owner.guard';
import { OwnerService } from 'src/shared/decorators/owner.decorator';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@Controller('/producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get(':id')
  @OwnerService(ProducerService)
  @UseGuards(AuthGuard, RolesGuards, OwnerGuard)
  @ApiOkResponse({ type: ProducerOutput })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<ProducerOutput> {
    const producer = await this.producerService.findById(id);
    return producer;
  }

  @Post()
  @ApiOkResponse({ type: ProducerOutput, isArray: true })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    data: CreateProducerInput,
  ): Promise<ProducerOutput> {
    const producer = await this.producerService.create(data);

    return producer;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ProducerOutput })
  @OwnerService(ProducerService)
  @UseGuards(AuthGuard, RolesGuards, OwnerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProducerDTO,
  ): Promise<ProducerOutput> {
    const producer = await this.producerService.update(id, data);

    return producer;
  }

  @Delete(':id')
  @OwnerService(ProducerService)
  @UseGuards(AuthGuard, RolesGuards, OwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<void> {
    await this.producerService.remove(id);
  }
}
