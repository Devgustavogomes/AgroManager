import z from "zod";

export const loginSchema = z.object({
  email: z
    .email("Por favor, digite um formato de e-mail válido.")
    .min(1, "O e-mail é obrigatório.")
    .trim(),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,36}$/)
    .trim(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface AuthResponse {
  accessToken: string;
}
