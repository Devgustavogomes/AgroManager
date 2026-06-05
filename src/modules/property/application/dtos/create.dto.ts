import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createPropertySchema = z.object({
  name: z.string().min(3).max(156).trim(),
  slug: z.string().min(3).max(156).trim().optional(),
  city: z.string().min(3).max(256).trim(),
  state: z.string().min(1).max(2).trim(),
  totalArea: z.number(),
  arableArea: z.number().optional(),
  vegetationArea: z.number().optional(),
});

export class CreatePropertyDto extends createZodDto(createPropertySchema) {}
