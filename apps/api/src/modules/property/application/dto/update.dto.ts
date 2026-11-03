import { createZodDto } from 'nestjs-zod';
import { createPropertySchema } from './create.dto';

const updatePropertySchema = createPropertySchema.partial();

export class UpdatePropertyDto extends createZodDto(updatePropertySchema) {}
