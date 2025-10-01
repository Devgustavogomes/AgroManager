import z from "zod";

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(16), // Adicionar um Regex depois
})

export type loginDto = z.infer<typeof loginSchema>