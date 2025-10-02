import z from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  PGUSER: z.string(),
  PGPASSWORD: z.string(),
  PGHOST: z.string(),
  PGPORT: z.coerce.number().default(5432),
  PGDATABASE: z.string(),
});
