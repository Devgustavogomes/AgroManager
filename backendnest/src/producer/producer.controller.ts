import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import type { ProducerDTO, ProducerIdDTO } from './dto/producer.dto';
import { idSchema } from './dto/producer.dto';
import { producerOutput } from './dto/producerOutput.dto';
import {
  changeProducerSchema,
  createProducerSchema,
} from './dto/producerInput.dto';
import type { changeProducerDTO } from './dto/producerInput.dto';

@Controller('/users')
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
  @UsePipes(new ZodValidationPipe(idSchema))
  async getUserById(@Param('id') id: ProducerIdDTO): Promise<producerOutput> {
    const producer = await this.producerService.getProducerById(id);
    return producer;
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createProducerSchema))
  async create(@Body() data: ProducerDTO): Promise<producerOutput> {
    const producer = await this.producerService.create(data);

    return producer;
  }

  @Patch(':id')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(changeProducerSchema))
  async change(
    @Param('id') id: ProducerIdDTO,
    @Body() data: changeProducerDTO,
  ): Promise<producerOutput> {
    const producer = await this.producerService.change(id, data);

    return producer;
  }

  @Delete(':id')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(idSchema))
  async delete(@Param('id') id: ProducerIdDTO): Promise<void> {
    await this.producerService.delete(id);
  }
}
