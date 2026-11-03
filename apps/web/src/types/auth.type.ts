import z from "zod";

export const loginSchema = z.object({
  email: z
    .email("Por favor, digite um formato de e-mail válido.")
    .min(1, "O e-mail é obrigatório.")
    .trim(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,36}$/,
      "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
    )
    .trim(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface AuthResponse {
  accessToken: string;
}

export const registerSchema = z
  .object({
    username: z.string().min(1, "O nome de usuário é obrigatório.").trim(),
    email: z
      .email("Por favor, digite um formato de e-mail válido.")
      .min(1, "O e-mail é obrigatório.")
      .trim(),
    confirmEmail: z
      .email("Por favor, digite um formato de e-mail válido.")
      .trim(),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,36}$/,
        "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
      )
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Os e-mails não coincidem.",
    path: ["confirmEmail"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type RegisterCredentials = z.infer<typeof registerSchema>;

export type RegisterPayload = Pick<
  RegisterCredentials,
  "username" | "email" | "password"
>;

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface RegisterResponse {
  username: string;
  email: string;
  producerId: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
