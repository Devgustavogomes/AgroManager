import z from 'zod';

export const createProducerSchema = z.object({
  name: z.string().min(5).max(128).trim(),
  CPForCNPJ: z.string().trim(),
  password: z.string().trim(),
});
export type CreateProducerInput = z.infer<typeof createProducerSchema>;
export type CreateProducerDTO = Omit<CreateProducerInput, 'password'> & {
  hashedPassword: string;
};

export const changeProducerSchema = z.object({
  name: z.string().min(5).max(128).trim(),
  CPForCNPJ: z.string(),
});

export type changeProducerDTO = z.infer<typeof changeProducerSchema>;
