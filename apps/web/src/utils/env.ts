import { envSchema as databaseEnvSchema } from "@repo/database/env";
import z from "zod";

export const envSchema = z.object({}).and(databaseEnvSchema);

export const env = envSchema.parse(process.env);
