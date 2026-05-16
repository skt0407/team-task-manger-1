import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CLIENT_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d")
});

export const env = envSchema.parse(process.env);
