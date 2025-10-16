import { API_ROUTES } from "../constant/api.routes";
import type { IAvailability } from "../types/IAvailability";
import type { ICategory } from "../types/ICategory";
import type { IWorker } from "../types/IWorker";
import axios from "./axios";

export const register = async (workerData: Partial<IWorker>) =>
  axios.post(API_ROUTES.WORKER_SERVICE.REGISTER, workerData, { withCredentials: true });

export const login = async (credentials: { email: string; password: string }) =>
  axios.post(API_ROUTES.WORKER_SERVICE.LOGIN, credentials, { withCredentials: true });

export const logoutWorker = async () =>
  axios.post(API_ROUTES.WORKER_SERVICE.LOGOUT, {}, { withCredentials: true });

export const buildAccount = async (workerId: string, accountData: Partial<IWorker>) =>
  axios.post(`${API_ROUTES.WORKER_SERVICE.BUILD_ACCOUNT}?workerId=${workerId}`, accountData, { withCredentials: true });

export const getWorkerDetails = async (workerId: string) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.FETCH_DETAILS}?workerId=${workerId}`);

export const updateWorkerData = async (workerData: { worker: Partial<IWorker>; availability: IAvailability }) =>
  axios.put(API_ROUTES.WORKER_SERVICE.UPDATE, { workerData });

export const forgotPassword = async (email: string) =>
  axios.post(API_ROUTES.WORKER_SERVICE.FORGOT_PASSWORD, { email });

export const resendOtp = async (email: string) =>
  axios.post(API_ROUTES.WORKER_SERVICE.RESEND_OTP, { email });

export const verifyOtp = async (email: string, otp: string) =>
  axios.post(API_ROUTES.WORKER_SERVICE.VERIFY_OTP, { email, otp });

export const resetPass = async (email: string, password: string) =>
  axios.post(API_ROUTES.WORKER_SERVICE.RESET_PASSWORD, { email, password });

export const fetchWorkHistory = async (workerId: string, currentPage: number, pageSize: number) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.FETCH_WORK_HISTORY}?workerId=${workerId}&currentPage=${currentPage}&pageSize=${pageSize}`);

export const fetchWorkDetails = async (workId: string) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.FETCH_WORK_DETAILS}?workId=${workId}`);

export const acceptWork = async (workId: string) =>
  axios.patch(`${API_ROUTES.WORKER_SERVICE.ACCEPT_WORK}?workId=${workId}`);

export const isCompletWork = async (workId: string, workerId: string) =>
  axios.patch(`${API_ROUTES.WORKER_SERVICE.COMPLETE_WORK}?workId=${workId}&workerId=${workerId}`);

export const fetchWorkerByWorkDetails = async (details: {
  categoryId: string;
  serviceId: string;
  workType: string;
  location: { lat: number; lng: number; pincode: string; address: string };
}) => axios.post(API_ROUTES.WORKER_SERVICE.SEARCH, details);

export const findWorkersByIds = async (workerIds: string[]) =>
  axios.post(API_ROUTES.WORKER_SERVICE.FIND_BY_IDS, { workerIds });

export const getAllCategories = async (): Promise<ICategory[]> => {
  const { data } = await axios.get(`${API_ROUTES.WORKER_SERVICE.FETCH_CATEGORIES}?currentPage=1&pageSize=1000`);
  return data.data.category;
};

export const getServiceByCategory = async (categoryIds: string[]) =>
  axios.post(API_ROUTES.WORKER_SERVICE.SERVICE_BY_CATEGORY, { categoryIds });

export const fetchWorkerCategory = async (categoryIds: string[]) =>
  axios.post(API_ROUTES.WORKER_SERVICE.FETCH_WORKER_CATEGORY, { categoryIds });

export const fetchWorkerService = async (serviceIds: string[]) =>
  axios.post(API_ROUTES.WORKER_SERVICE.FETCH_WORKER_SERVICE, { serviceIds });

export const fetchWallet = async (workerId: string) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.WALLET}?workerId=${workerId}`);

export const fetchWorkerEarnings = async (workerId: string, filter: string) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.EARNINGS}?workerId=${workerId}&filter=${filter}`);

export const fetchAssignedWorks = async (workerId: string) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.ASSIGNED_WORKS}?workerId=${workerId}`);

export const fetchRequestedWorks = async (workerId: string) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.REQUESTED_WORKS}?workerId=${workerId}`);

export const fetchSubscriptionPlans = async (currentPage: number, limit: number, status: boolean) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.FETCH_SUBSCRIPTIONS}?currentPage=${currentPage}&limit=${limit}&status=${status}`);

export const activateSubscriptionPlan = async (workerId: string, planId: string) =>
  axios.get(`${API_ROUTES.WORKER_SERVICE.ACTIVATE_SUBSCRIPTION}?workerId=${workerId}&planId=${planId}`);