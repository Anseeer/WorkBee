import { API_ROUTES } from "../constant/api.routes";
import type { IAvailability } from "../types/IAvailability";
import type { ICategory } from "../types/ICategory";
import type { ISearchTerm } from "../types/ISearchTerm";
import type { IWorker } from "../types/IWorker";
import axios from "./axios";

export const register = async (workerData: Partial<IWorker>) => {
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.REGISTER, workerData, {
    withCredentials: true,
  });
  return response;
};

export const verifyRegister = async (verifyData: { tempWorkerId: string, otp: string }) => {
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.VERIFY_REGISTER, verifyData, {
    withCredentials: true,
  });
  return response;
};

export const reVerify = async (tempWorkerId: string) => {
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.REVERIFY_REGISTER, { tempWorkerId }, {
    withCredentials: true,
  });
  return response;
};

export const login = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.LOGIN, credentials, {
    withCredentials: true,
  });
  return response;
};

export const logoutWorker = async () => {
  await axios.post(API_ROUTES.WORKER_SERVICE.LOGOUT, {}, { withCredentials: true });
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.FORGOT_PASSWORD, { email });
  return response;
};

export const resendOtp = async (email: string) => {
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.RESEND_OTP, { email });
  return response;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.VERIFY_OTP, { email, otp });
  return response;
};

export const resetPass = async (email: string, password: string) => {
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.RESET_PASSWORD, { email, password });
  return response;
};

export const buildAccount = async (
  accountData: Partial<IWorker>
) => {
  const response = await axios.post(
    `${API_ROUTES.WORKER_SERVICE.BUILD_ACCOUNT}`,
    accountData,
    { withCredentials: true }
  );
  return response;
};

export const getWorkerDetails = async () => {
  return axios.get(`${API_ROUTES.WORKER_SERVICE.FETCH_DETAILS}`);
};

export const updateWorkerData = async (workerData: {
  worker: Partial<IWorker>;
  availability: IAvailability;
}) => {
  const response = await axios.put(API_ROUTES.WORKER_SERVICE.UPDATE, { workerData });
  return response;
};

export const findWorkersByIds = async (workerIds: string[]) => {
  if (!workerIds) throw new Error("Worker IDs not provided");
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.FIND_BY_IDS, { workerIds });
  return response.data.data;
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  const res = await axios.get(`${API_ROUTES.WORKER_SERVICE.FETCH_CATEGORIES}?currentPage=1&pageSize=1000`);
  return res.data.data.category;
};

export const getServiceByCategory = async (categoryIds: string[]) => {
  if (!categoryIds) throw new Error("Category IDs not provided");
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.SERVICE_BY_CATEGORY, { categoryIds });
  return response;
};

export const fetchWorkerCategory = async (categoryIds: string[]) => {
  if (!categoryIds) throw new Error("Category IDs not provided");
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.FETCH_WORKER_CATEGORY, { categoryIds });
  return response;
};

export const fetchWorkerService = async (serviceIds: string[]) => {
  if (!serviceIds) throw new Error("Service IDs not provided");
  const response = await axios.post(API_ROUTES.WORKER_SERVICE.FETCH_WORKER_SERVICE, { serviceIds });
  return response;
};

export const fetchWorkerByWorkDetails = async (details: ISearchTerm) => {
  const { data } = await axios.post(API_ROUTES.WORKER_SERVICE.SEARCH, details);
  return data;
};

export const fetchWorkHistory = async (
  currentPage: number,
  pageSize: number
) => {
  const response = await axios.get(
    `${API_ROUTES.WORKER_SERVICE.FETCH_WORK_HISTORY}?currentPage=${currentPage}&pageSize=${pageSize}`
  );
  return response.data;
};

export const fetchWorkDetails = async (workId: string) => {
  const response = await axios.get(`${API_ROUTES.WORKER_SERVICE.FETCH_WORK_DETAILS}?workId=${workId}`);
  return response.data.data;
};

export const acceptWork = async (workId: string) => {
  const response = await axios.patch(`${API_ROUTES.WORKER_SERVICE.ACCEPT_WORK}?workId=${workId}`);
  return response.data.data;
};

export const isCompletWork = async (workId: string, hoursWorked: string) => {
  const response = await axios.patch(
    `${API_ROUTES.WORKER_SERVICE.COMPLETE_WORK}?workId=${workId}&hoursWorked=${hoursWorked}`
  );
  return response.data.data;
};

export const fetchAssignedWorks = async () => {
  const response = await axios.get(`${API_ROUTES.WORKER_SERVICE.ASSIGNED_WORKS}`);
  return response.data.data;
};

export const fetchRequestedWorks = async () => {
  const response = await axios.get(`${API_ROUTES.WORKER_SERVICE.REQUESTED_WORKS}`);
  return response.data.data;
};

export const fetchWallet = async () => {
  const response = await axios.get(`${API_ROUTES.WORKER_SERVICE.WALLET}`);
  return response.data.data;
};

export const fetchWorkerEarnings = async (filter: string) => {
  if (!filter) throw new Error("Filter not provided");
  const response = await axios.get(
    `${API_ROUTES.WORKER_SERVICE.EARNINGS}?filter=${filter}`
  );
  return response.data.data;
};

export const fetchSubscriptionPlans = async (
  currentPage: number,
  limit: number,
  status: boolean
) => {
  const response = await axios.get(
    `${API_ROUTES.WORKER_SERVICE.FETCH_SUBSCRIPTIONS}?currentPage=${currentPage}&limit=${limit}&status=${status}`
  );
  return response.data.data;
};

export const activateSubscriptionPlan = async (planId: string) => {
  const response = await axios.get(
    `${API_ROUTES.WORKER_SERVICE.ACTIVATE_SUBSCRIPTION}?planId=${planId}`
  );
  return response.data.data;
};

export const reApplyWorker = async () => {
  const response = await axios.get(`${API_ROUTES.WORKER_SERVICE.REAPPROVAl}`);
  return response.data.data;
};

export const ChangePassword = async (currentPass: string, newPass: string) => {
  const response = await axios.post(`${API_ROUTES.WORKER_SERVICE.CHANGE_PASSWORD}`, { currentPass, newPass });
  return response.data.data;
};