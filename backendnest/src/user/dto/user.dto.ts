import z from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(5).max(32).trim(),
  email: z.email(),
  password: z.string().min(8).max(16), // Adicionar um Regex depois
});
export type createUserDto = z.infer<typeof createUserSchema>;

export const idSchema = z.object({
  id: z.uuid(),
});

export type idDto = z.infer<typeof idSchema>;

export const changeUserSchema = z.object({
  name: z.string().min(5).max(32).trim().optional(),
  email: z.email().optional(),
});

export type changeUserDto = z.infer<typeof changeUserSchema>;
