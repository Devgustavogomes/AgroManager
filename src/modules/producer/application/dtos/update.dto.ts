import { createZodDto } from 'nestjs-zod';
import { createProducerSchema } from './create.dto';

const changeProducerSchema = createProducerSchema
  .omit({
    password: true,
  })
  .partial();

export class UpdateProducerDTO extends createZodDto(changeProducerSchema) {}
