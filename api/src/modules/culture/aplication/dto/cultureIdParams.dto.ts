import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const idSchema = z.object({
  id: z.uuid().optional(),
  propertyId: z.uuid(),
});

export class CultureIdParams extends createZodDto(idSchema) {}
