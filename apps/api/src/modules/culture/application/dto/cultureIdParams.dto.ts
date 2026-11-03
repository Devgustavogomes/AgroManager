import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const idSchema = z.object({
  id: z.uuid().optional(),
  slug: z.string(),
});

export class CultureIdParams extends createZodDto(idSchema) {}
