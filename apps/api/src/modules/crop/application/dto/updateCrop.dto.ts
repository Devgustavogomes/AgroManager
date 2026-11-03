import { createCropSchema } from './createCrop.dto';
import { createZodDto } from 'nestjs-zod';

const updateCropSchema = createCropSchema.partial();

export class UpdateCropInput extends createZodDto(updateCropSchema) {}
