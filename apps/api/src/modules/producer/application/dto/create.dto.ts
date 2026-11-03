import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createProducerSchema = z.object({
  username: z.string().min(3).max(256).trim(),
  email: z.email().trim(),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,36}$/)
    .trim(),
});

export class CreateProducerInput extends createZodDto(createProducerSchema) {}
