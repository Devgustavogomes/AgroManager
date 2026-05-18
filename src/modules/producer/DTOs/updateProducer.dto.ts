import { createZodDto } from 'nestjs-zod';
import { createProducerSchema } from './createProducer.dto';

const changeProducerSchema = createProducerSchema
  .omit({
    password: true,
  })
  .partial();

export class UpdateProducerDTO extends createZodDto(changeProducerSchema) {}
