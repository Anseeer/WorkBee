export const COOKIE_CONFIG = {
  MAX_AGE: 24 * 60 * 60 * 1000, 
  SAME_SITE: "strict" as const,
  HTTP_ONLY: true,
  SECURE: process.env.NODE_ENV === "production",
};
