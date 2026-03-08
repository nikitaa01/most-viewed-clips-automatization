import { envSchema as databaseEnvSchema } from "@repo/database/env";
import { z } from "zod";

const envSchema = z
  .object({
    TWITCH_CLIENT_ID: z.string(),
    TWITCH_CLIENT_SECRET: z.string(),
    GAME_NAME: z.string(),
    TARGET_DURATION_SECONDS: z
      .string()
      .optional()
      .default("3600")
      .transform(Number),

    BUCKET_ACCESS_KEY_ID: z.string(),
    BUCKET_SECRET_ACCESS_KEY: z.string(),
    BUCKET_ENDPOINT: z.string(),
    BUCKET_NAME: z.string(),
    BUCKET_INTRO_PATH: z.string().endsWith(".mp4"),
    BUCKET_OUTRO_PATH: z.string().endsWith(".mp4"),
    BUCKET_THUMBNAIL_PATH: z.string().endsWith(".webp"),

    OPEN_ROUTER_API_KEY: z.string(),
  })
  .and(databaseEnvSchema);

export const env = envSchema.parse(process.env);
