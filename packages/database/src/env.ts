import z from "zod";

export const envSchema = z.object({
  TURSO_CONNECTION_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
