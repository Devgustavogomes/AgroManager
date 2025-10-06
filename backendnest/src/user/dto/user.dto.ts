import z from 'zod';

export interface UserDTO {
  name: string;
  email: string;
  password: string;
}

export type UserOutput = Omit<UserDTO, 'password'> & { id: string };

export const createUserSchema = z.object({
  name: z.string().min(5).max(32).trim(),
  email: z.email(),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/),
});

export type CreateUserDTO = Omit<UserDTO, 'password'> & {
  hashedPassword: string;
};

export const idSchema = z.object({
  id: z.uuid(),
});

export type UserIdDTO = z.infer<typeof idSchema>;

export const changeUserSchema = z.object({
  name: z.string().min(5).max(32).trim().optional(),
  email: z.email().optional(),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)
    .optional(),
});

export type changeUserDTO = z.infer<typeof changeUserSchema>;
