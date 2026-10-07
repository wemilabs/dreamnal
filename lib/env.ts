import "server-only";

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  ENTRY_ENCRYPTION_KEY: z
    .string()
    .refine((v) => Buffer.from(v, "base64").length === 32, {
      message: "ENTRY_ENCRYPTION_KEY must be base64 for exactly 32 bytes",
    }),
  NEON_AUTH_BASE_URL: z.url(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32),
  XAI_API_KEY: z.string().min(1),
  XAI_API_BASE_URL: z.url().default("https://api.x.ai/v1/stt"),
});

export const env = envSchema.parse(process.env);
