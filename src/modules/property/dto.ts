import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createPropertySchema = z.object({
  name: z.string().min(3).max(156).trim(),
  city: z.string().min(3).max(256).trim(),
  state: z.string().min(1).max(5).trim(),
  arableArea: z.number(),
  vegetationArea: z.number(),
});

const updatePropertySchema = createPropertySchema.partial();

const propertyOutputDto = createPropertySchema.extend({
  idProperty: z.uuid(),
  idProducer: z.uuid(),
  totalArea: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
});

export class CreatePropertyDto extends createZodDto(createPropertySchema) {}

export class UpdatePropertyDto extends createZodDto(updatePropertySchema) {}

export class PropertyOutputDto extends createZodDto(propertyOutputDto) {}
