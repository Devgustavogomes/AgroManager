import { Role } from 'src/shared/types/role';
import { createProducerSchema } from './create.dto';
import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const producerOutputSchema = createProducerSchema
  .omit({ password: true })
  .extend({
    idProducer: z.string(),
    role: z.enum(Role),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().nullable(),
  });

export class ProducerOutput extends createZodDto(producerOutputSchema) {}
