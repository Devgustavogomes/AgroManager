import z from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string(),
  PGUSER: z.string(),
  PGPASSWORD: z.string(),
  PGHOST: z.string(),
  PGPORT: z.coerce.number().default(5432),
  PGDATABASE: z.string(),
  PGSSLMODE: z.string().optional(),
  SECRET: z.string(),
  REFRESH_SECRET: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_SSL: z.string(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
});
