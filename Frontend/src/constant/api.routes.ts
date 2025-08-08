export const API_ROUTES = {
  USER: {
    REGISTER: "/register",
    LOGIN: "/login",
    HOME: "/home",
    VERIFY_OTP: "/verify-otp",
    FORGOT_PASS: "/forgot-password",
    RESET_PASS: "/reset-password",
  },
  ADMIN: {
    LOGIN: "/admins/login",
    REGISTER: "/admins/register",
    DASHBOARD: "/admins/dashboard",
    FORGOT_PASS: "/admins/forgot-password",
    LOGOUT:"/admins/logout"
  },
  WORKER: {
    REGISTER: "/workers/register",
    DASHBOARD: "/workers/dashboard",
    LOGIN: "/workers/login",
    LANDING: "/workers",
    VERIFY_OTP: "/workers/verify-otp",
    FORGOT_PASS: "/workers/forgot-password",
    RESET_PASS: "/workers/reset-password",
  },
};
