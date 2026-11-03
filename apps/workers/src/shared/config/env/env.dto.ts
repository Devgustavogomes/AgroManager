import z from 'zod';

export const envSchema = z.object({
  QUEUE_HOST: z.string(),
  QUEUE_PORT: z.string(),
  QUEUE_PASSWORD: z.string().optional(),
  QUEUE_USERNAME: z.string().optional(),
  QUEUE_SSL: z.string().optional(),
  PORT: z.coerce.number().default(3000),
});
