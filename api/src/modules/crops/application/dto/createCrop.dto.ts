import z from 'zod';
import { CropStatus } from '../../domain/constants/crop-status.enum';
import { PestStatus } from '../../domain/constants/pest-status';
import { createZodDto } from 'nestjs-zod';

export const createCropSchema = z.object({
  name: z.string().min(3).max(64).trim(),
  status: z.enum(CropStatus),
  allocatedArea: z.number(),
  plantingDate: z.string(),
  harvestDateExpected: z.string(),
  harvestDateActual: z.string().nullable(),
  pestStatus: z.enum(PestStatus),
});

export class CreateCropInput extends createZodDto(createCropSchema) {}
