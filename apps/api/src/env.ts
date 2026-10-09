import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
  process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test-anon-key';
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key';
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
  process.env.DIRECT_URL = process.env.DIRECT_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform(Number),
  APP_BASE_URL: z.string().url().default('http://localhost:5173'),
  ADMIN_BASE_URL: z.string().url().default('http://localhost:5174'),
  API_BASE_URL: z.string().url().default('http://localhost:4000'),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),

  KHQR_API_BASE: z.string().url().default('https://api.khqr.dev/v1'),
  KHQR_CHECKOUT_BASE: z.string().url().default('https://checkout.khqr.dev'),
  KHQR_RBK_TOKEN: z.string().default('mock-rbk-token'),
  KHQR_WEBHOOK_SECRET: z.string().default('mock-webhook-secret'),

  SUPPLIER_PROVIDER: z.string().default('mock'),
  SUPPLIER_API_KEY: z.string().default('mock-supplier-key'),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  SENTRY_DSN: z.string().optional(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }
  const data = result.data;
  if (data.NODE_ENV === 'production' && data.SUPPLIER_PROVIDER === 'mock') {
    console.error('❌ FATAL: Cannot run in production mode with mock supplier provider!');
    process.exit(1);
  }
  return data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
