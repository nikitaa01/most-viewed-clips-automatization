import { z } from "zod";

const envVariables = z.object({
  TWITCH_CLIENT_ID: z.string(),
  TWITCH_CLIENT_SECRET: z.string(),
  GAME_NAME: z.string(),
  TARGET_DURATION_SECONDS: z
    .string()
    .optional()
    .default("3600")
    .transform(Number),

  TURSO_CONNECTION_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),

  BUCKET_ACCESS_KEY_ID: z.string(),
  BUCKET_SECRET_ACCESS_KEY: z.string(),
  BUCKET_ENDPOINT: z.string(),
  BUCKET_NAME: z.string(),
  BUCKET_INTRO_PATH: z.string().endsWith(".mp4"),
  BUCKET_OUTRO_PATH: z.string().endsWith(".mp4"),
  BUCKET_THUMBNAIL_PATH: z.string().endsWith(".webp"),
});

export const env = envVariables.parse(process.env);
