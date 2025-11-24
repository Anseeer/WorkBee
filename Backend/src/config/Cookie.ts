import dotenv from "dotenv";

// const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
// dotenv.config({ path: envFile });

dotenv.config()

const isProd = process.env.NODE_ENV === "production";

export const COOKIE_CONFIG = {
  MAX_AGE: Number(process.env.TOKEN_MAX_AGE) * 1000,
  REFRESH_MAX_AGE: Number(process.env.REFRESH_TOKEN_MAX_AGE) * 1000,
  SAME_SITE: (isProd ? "none" : "lax") as "none" | "lax" | "strict" | boolean | undefined,
  HTTP_ONLY: true,
  SECURE: isProd,
};
