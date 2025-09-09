export const ROLE = {
  USER: "User",
  ADMIN: "Admin",
  WORKER: "Worker",
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];
