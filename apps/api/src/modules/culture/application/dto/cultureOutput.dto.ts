import z from 'zod';
import { createCultureSchema } from './createCulture.dto';
import { createZodDto } from 'nestjs-zod';

const outputCultureSchema = createCultureSchema.extend({
  cultureId: z.uuid(),
  propertyId: z.uuid(),
  allocatedArea: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
});

export class CultureOutput extends createZodDto(outputCultureSchema) {}
