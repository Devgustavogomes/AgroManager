import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const loginSchema = z.object({
  CPForCNPJ: z.preprocess(
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

export class loginInputDto extends createZodDto(loginSchema) {}
