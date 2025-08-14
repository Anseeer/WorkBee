import type { IAvailability } from "../types/IAvailability";
import type { ICategory } from "../types/ICategory";
import type { IWorker } from "../types/IWorker";
import axios from "./axios";

export const register = async (workerData: Partial<IWorker>) => {
  const response = await axios.post("/workers/register", workerData, { withCredentials: true });
  return response;
};

export const login = async (credentials: { email: string, password: string }) => {
  const response = await axios.post("/workers/login", credentials, { withCredentials: true });
  return response;
}

export const buildAccount = async (workerId: string | undefined, accountData: Partial<IWorker>) => {
  console.log("Build account service to backedn")
  console.log("Worker id :", workerId)
  const response = await axios.post(`workers/build-account?workerId=${workerId}`, accountData, { withCredentials: true });
  return response;
}

export const getWorkerDetails = async (workerId: string) => {
  if (!workerId) {
    throw new Error("Cant Get WorkerId ID");
  }
  return axios.get(`/workers/fetch-details?workerId=${workerId}`);
};

export const logoutWorker = async () => {
  await axios.post('workers/logout', {}, { withCredentials: true });
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  const res = await axios.get("/categories/categories");
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

export const getServiceByCategory = async (categoryIds: string[]) => {
  const response = await axios.post('services/by-categories', { categoryIds });
  return response;
}

export const fetchWorkerCategory = async (categoryIds: string[]) => {
  const response = await axios.post('categories/by-worker', { categoryIds });
  return response;
}

export const fetchWorkerService = async (serviceIds: string[]) => {
  const response = await axios.post('services/by-worker', { serviceIds });
  return response;
}

export const updateWorkerData = async (workerData: { worker: Partial<IWorker>, availability: IAvailability }) => {
  const response = await axios.put("workers/update", { workerData });
  return response;
}

export const fetchWorkerByWorkDetails = async (details:
  {
    categoryId: string;
    serviceId: string;
    workType: string;
    location: {
      lat: number;
      lng: number;
      pincode: string;
      address: string;
    };
  }) => {
  const { data } = await axios.post("workers/search", details);
  return data;
};

export const fetchWorkHistory = async (workerId: string) => {
  if (!workerId) {
    throw new Error("Cant Get WorkerId");
  }
  const response = await axios.get(`works/workers?workerId=${workerId}`);
  return response.data;
}

export const fetchWorkDetails = async (workId: string) => {
  const response = await axios.get(`works/details?workId=${workId}`);
  return response.data;
}

export const acceptWork = async (workId: string) => {
  const response = await axios.patch(`works/accept?workId=${workId}`)
  return response.data.data;
}

export const isCompletWork = async (workId: string) => {
  const response = await axios.patch(`works/is-completed?workId=${workId}`)
  return response.data.data;
}

