import { ProducerDTO } from './producer.dto';
import z from 'zod';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export const createProducerSchema = z.object({
  name: z.string().min(5).max(128).trim(),
  CPForCNPJ: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => cpf.isValid(val) || cnpj.isValid(val), {
      message: 'CPF ou CNPJ inválido',
    }),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/),
});

export type CreateProducerDTO = Omit<ProducerDTO, 'password'> & {
  hashedPassword: string;
};

export const changeProducerSchema = z.object({
  name: z.string().min(5).max(128).trim().optional(),
  CPForCNPJ: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => cpf.isValid(val) || cnpj.isValid(val), {
      message: 'CPF ou CNPJ inválido',
    })
    .optional(),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)
    .optional(),
});

export type changeProducerDTO = z.infer<typeof changeProducerSchema>;
