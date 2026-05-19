import z from 'zod';
import { createPropertySchema } from './create.dto';
import { createZodDto } from 'nestjs-zod';

const propertyOutputDto = createPropertySchema.extend({
  propertyId: z.uuid(),
  producerId: z.uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
});

export class PropertyOutputDto extends createZodDto(propertyOutputDto) {}
