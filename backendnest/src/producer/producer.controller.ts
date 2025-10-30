import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { producerOutput } from './dto/producerOutput.dto';
import {
  changeProducerSchema,
  createProducerSchema,
} from './dto/producerInput.dto';
import type {
  changeProducerDTO,
  CreateProducerInput,
} from './dto/producerInput.dto';

@Controller('/producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  @HttpCode(200)
  async getUsers(): Promise<producerOutput[]> {
    const producers = await this.producerService.getProducers();

    return producers;
  }

  @Get(':id')
  @HttpCode(200)
  async getUserById(@Param('id') id: string): Promise<producerOutput> {
    const producer = await this.producerService.getProducerById(id);
    return producer;
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(createProducerSchema))
    data: CreateProducerInput,
  ): Promise<producerOutput> {
    const producer = await this.producerService.create(data);

    return producer;
  }

  @Patch(':id')
  @HttpCode(200)
  async change(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(changeProducerSchema)) data: changeProducerDTO,
  ): Promise<producerOutput> {
    const producer = await this.producerService.change(id, data);

    return producer;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.producerService.delete(id);
  }
}
