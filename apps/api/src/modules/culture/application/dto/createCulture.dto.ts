import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createCultureSchema = z.object({
  name: z.string().min(3).max(64).trim(),
  allocatedArea: z.number().nonnegative('Area must be a positive number'),
});

export class CreateCultureInput extends createZodDto(createCultureSchema) {}
