import { Role } from 'src/shared/types/role';
import { createProducerSchema } from './create.dto';
import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const producerOutputSchema = createProducerSchema
  .omit({ password: true })
  .extend({
    producerId: z.string(),
    role: z.enum(Role),
    createdAt: z.string(),
    updatedAt: z.string().nullable(),
  });

export class ProducerOutput extends createZodDto(producerOutputSchema) {}
