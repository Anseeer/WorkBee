import type { ICategory } from "../types/ICategory";
import type { IWorker } from "../types/IWorker";
import axios from "./axios";

export const register = async (workerData: Partial<IWorker>) => {
  const response = await axios.post("workers/register", workerData, { withCredentials: true });
  return response;
};

export const login = async (credentials: { email: string, password: string }) => {
  const response = await axios.post("workers/login", credentials, { withCredentials: true });
  return response;
}

export const logoutWorker = async () => {
  await axios.post('workers/logout', {}, { withCredentials: true });
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  const res = await axios.get("/categories/getAllCategories");
  console.log(res.data.data)
  return res.data.data.categories;
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post('workers/forgot-password', { email });
  return response;
}

export const resendOtp = async (email: string) => {
  const response = await axios.post('workers/resend-otp', { email });
  return response;
}

export const verifyOtp = async (email: string, otp: string) => {
  const response = await axios.post('workers/verify-otp', { email, otp });
  return response;
}

export const resetPass = async (email: string, password: string) => {
  const response = await axios.post('workers/reset-password', { email, password });
  return response;
}