import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const idSchema = z.object({
  id: z.uuid(),
});

export class IdDto extends createZodDto(idSchema) {}
