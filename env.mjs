import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const isDev = process.env.NODE_ENV === "development"

export const env = createEnv({
  server: {
    NEXTAUTH_URL: isDev ? z.string().optional() : z.string().url().optional(),
    NEXTAUTH_SECRET: isDev ? z.string().optional() : z.string().min(1),
    GITHUB_CLIENT_ID: isDev ? z.string().optional() : z.string().min(1),
    GITHUB_CLIENT_SECRET: isDev ? z.string().optional() : z.string().min(1),
    GITHUB_ACCESS_TOKEN: isDev ? z.string().optional() : z.string().min(1),
    DATABASE_URL: isDev ? z.string().optional() : z.string().min(1),
    SMTP_FROM: isDev ? z.string().optional() : z.string().min(1),
    POSTMARK_API_TOKEN: isDev ? z.string().optional() : z.string().min(1),
    POSTMARK_SIGN_IN_TEMPLATE: isDev ? z.string().optional() : z.string().min(1),
    POSTMARK_ACTIVATION_TEMPLATE: isDev ? z.string().optional() : z.string().min(1),
    STRIPE_API_KEY: isDev ? z.string().optional() : z.string().min(1),
    STRIPE_WEBHOOK_SECRET: isDev ? z.string().optional() : z.string().min(1),
    STRIPE_PRO_MONTHLY_PLAN_ID: isDev ? z.string().optional() : z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: isDev ? z.string().optional() : z.string().min(1),
  },
  runtimeEnv: process.env,
})
