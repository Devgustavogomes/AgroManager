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
import { AuthGuard } from 'src/shared/infrastructure/guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/shared/application/types/authenticatedRequest';
import { ProducerOutput } from '../application/dto/output.dto';
import { CreateProducerInput } from '../application/dto/create.dto';
import { UpdateProducerDTO } from '../application/dto/update.dto';
import { CreateProducerUseCase } from '../application/use-cases/createProducer';
import { DeleteProducerUseCase } from '../application/use-cases/deleteProducer';
import { UpdateProducerUseCase } from '../application/use-cases/updateProducer';
import { FindByIdProducerUseCase } from '../application/use-cases/findByIdProducer';

@Controller('/producers')
export class ProducerController {
  constructor(
    private readonly createProducer: CreateProducerUseCase,
    private readonly updateProducer: UpdateProducerUseCase,
    private readonly deleteProducer: DeleteProducerUseCase,
    private readonly findByIdProducer: FindByIdProducerUseCase,
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProducerOutput })
  @ApiBearerAuth()
  async findById(@Req() req: AuthenticatedRequest): Promise<ProducerOutput> {
    return await this.findByIdProducer.execute(req.producer.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ProducerOutput, isArray: true })
  async create(
    @Body()
    data: CreateProducerInput,
  ): Promise<ProducerOutput> {
    return await this.createProducer.execute(data);
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
    return await this.updateProducer.execute(req.producer.id, data);
  }

  @Delete('')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async remove(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.deleteProducer.execute(req.producer.id);
  }
}
