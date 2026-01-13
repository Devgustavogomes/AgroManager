import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const propertySchema = z.object({
  name: z.string().min(3).max(156).trim(),
  city: z.string().min(3).max(256).trim(),
  state: z.string().min(1).max(5).trim(),
  arableArea: z.number(),
  vegetationArea: z.number(),
});

export class CreatePropertyInputDto extends createZodDto(propertySchema) {}

export class UpdatePropertyInputDto extends createZodDto(
  propertySchema.partial(),
) {}
