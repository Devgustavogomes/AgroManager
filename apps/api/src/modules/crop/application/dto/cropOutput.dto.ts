import z from 'zod';
import { createCropSchema } from './createCrop.dto';
import { createZodDto } from 'nestjs-zod';

const outputCropSchema = createCropSchema.extend({
  cropId: z.uuid(),
  cultureId: z.uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
});

export class CropOutput extends createZodDto(outputCropSchema) {}
