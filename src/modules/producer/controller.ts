import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  UseGuards,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ProducerService } from './service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/shared/types/authenticatedRequest';
import { ProducerOutput } from './DTOs/producerOutput.dto';
import { CreateProducerInput } from './DTOs/createProducer.dto';
import { UpdateProducerDTO } from './DTOs/updateProducer.dto';

@Controller('/producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProducerOutput })
  @ApiBearerAuth()
  async findById(@Req() req: AuthenticatedRequest): Promise<ProducerOutput> {
    return await this.producerService.findById(req.producer.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ProducerOutput, isArray: true })
  async create(
    @Body()
    data: CreateProducerInput,
  ): Promise<ProducerOutput> {
    return await this.producerService.create(data);
  }

  @Patch('')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProducerOutput })
  @ApiBearerAuth()
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProducerDTO,
  ): Promise<ProducerOutput> {
    return await this.producerService.update(req.producer.id, data);
  }

  @Delete('')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async remove(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.producerService.remove(req.producer.id);
  }
}
