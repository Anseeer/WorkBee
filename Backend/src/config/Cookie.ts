import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

export const COOKIE_CONFIG = {
  MAX_AGE: Number(process.env.TOKEN_MAX_AGE) * 1000,
  REFRESH_MAX_AGE: Number(process.env.REFRESH_TOKEN_MAX_AGE) * 1000,
  SAME_SITE: "strict" as const,
  HTTP_ONLY: true,
  SECURE: process.env.NODE_ENV === "production",
};
