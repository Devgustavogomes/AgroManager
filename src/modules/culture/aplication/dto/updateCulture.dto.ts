import { createZodDto } from 'nestjs-zod';
import { createCultureSchema } from './createCulture.dto';

const updateCultureSchema = createCultureSchema.partial();

export class UpdateCultureInput extends createZodDto(updateCultureSchema) {}
