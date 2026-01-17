import { createZodDto } from 'nestjs-zod';
import { Role } from 'src/shared/types/role';
import z from 'zod';

const createProducerSchema = z.object({
  username: z.string().min(3).max(256).trim(),
  email: z.email().trim(),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,36}$/)
    .trim(),
});

const changeProducerSchema = createProducerSchema
  .omit({
    password: true,
  })
  .partial();

const producerOutputSchema = createProducerSchema
  .omit({ password: true })
  .extend({
    idProducer: z.string(),
    role: z.enum(Role),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().nullable(),
  });

export class CreateProducerInput extends createZodDto(createProducerSchema) {}

export class UpdateProducerDTO extends createZodDto(changeProducerSchema) {}

export class ProducerOutput extends createZodDto(producerOutputSchema) {}
