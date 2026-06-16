import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const idSchema = z.object({
  id: z.uuid().optional(),
  cultureId: z.uuid(),
});

export class IdCropDto extends createZodDto(idSchema) {}
