import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createProducerSchema = z.object({
  username: z.string().min(5).max(128).trim(),
  cpf_or_cnpj: z.preprocess(
    (val) => {
      if (typeof val !== 'string') return val;

      return val.replace(/\D/g, '');
    },
    z.string().regex(/^(?:\d{11}|\d{14})$/, 'Invalid CPF or CNPJ'),
  ),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,36}$/)
    .trim(),
});

export class CreateProducerInput extends createZodDto(createProducerSchema) {}

export const changeProducerSchema = createProducerSchema
  .omit({
    password: true,
  })
  .partial();

export class UpdateProducerDTO extends createZodDto(changeProducerSchema) {}
