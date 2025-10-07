import z from 'zod';

enum Role {
  ADMIN,
  USER,
}
export interface ProducerDTO {
  name: string;
  CPForCNPJ: string;
  password: string;
  role: Role;
}

export const idSchema = z.object({
  id: z.uuid(),
});

export type ProducerIdDTO = z.infer<typeof idSchema>;
