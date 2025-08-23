import dotenv from "dotenv";
dotenv.config();

export const COOKIE_CONFIG = {
  MAX_AGE: Number(process.env.TOKEN_MAX_AGE) * 1000,
  REFRESH_MAX_AGE: Number(process.env.REFRESH_TOKEN_MAX_AGE) * 1000,
  SAME_SITE: "strict" as const,
  HTTP_ONLY: true,
  SECURE: process.env.NODE_ENV === "production",
};
