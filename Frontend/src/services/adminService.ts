import { API_ROUTES } from "../constant/api.routes";
import type { ISubscription } from "../types/ISubscription";
import axios from "./axios";


export const login = async (credentials: { email: string; password: string }) => {
    return await axios.post(API_ROUTES.ADMIN_SERVICE.LOGIN, credentials, { withCredentials: true });
};

export const logoutAdmin = async () => {
    return await axios.post(API_ROUTES.ADMIN_SERVICE.LOGOUT, {}, { withCredentials: true });
};

export const fetchUsers = async (currentPage: number, pageSize: number) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.FETCH_USERS}?currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const setIsActiveUsers = async (id: string) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.SET_USER_STATUS}?id=${id}`);
};

export const fetchWorkers = async (currentPage: number, pageSize: number) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.FETCH_WORKERS}?currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const fetchWorkersNonVerified = async () => {
    return await axios.get(API_ROUTES.ADMIN_SERVICE.FETCH_NON_VERIFIED_WORKERS);
};

export const fetchAvailability = async (id: string | null) => {
    if (!id) throw new Error("Worker Id Not Get");
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.FETCH_AVAILABILITY}?workerId=${id}`);
};

export const setIsActiveWorkers = async (id: string) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.SET_WORKER_STATUS}?id=${id}`);
};

export const approveWorker = async (id: string) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.APPROVE_WORKER}?workerId=${id}`);
};

export const rejectedWorker = async (id: string) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.REJECT_WORKER}?workerId=${id}`);
};

export const fetchCategory = async (currentPage: number, pageSize: number) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.FETCH_CATEGORY}?currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const addCategory = async (category: { name: string; description: string; imageUrl?: string }) => {
    return await axios.post(API_ROUTES.ADMIN_SERVICE.CREATE_CATEGORY, category);
};

export const updateCategory = async (
    id: string,
    currentPage: number,
    pageSize: number,
    category: { name: string; description: string; imageUrl?: string }
) => {
    return await axios.post(`${API_ROUTES.ADMIN_SERVICE.UPDATE_CATEGORY}?categoryId=${id}&currentPage=${currentPage}&pageSize=${pageSize}`, category);
};

export const deleteCategory = async (id: string) => {
    return await axios.delete(`${API_ROUTES.ADMIN_SERVICE.DELETE_CATEGORY}?categoryId=${id}`);
};

export const setIsActiveCategory = async (id: string) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.TOGGLE_CATEGORY_ACTIVE}?categoryId=${id}`);
};

export const fetchService = async (currentPage: number, pageSize: number) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.FETCH_SERVICES}?currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const addService = async (service: { name: string; wage: string; category: string }) => {
    return await axios.post(API_ROUTES.ADMIN_SERVICE.CREATE_SERVICE, service);
};

export const updateService = async (id: string, service: { name: string; wage: string; category: string }) => {
    return await axios.post(`${API_ROUTES.ADMIN_SERVICE.UPDATE_SERVICE}?serviceId=${id}`, service);
};

export const deleteService = async (id: string) => {
    return await axios.delete(`${API_ROUTES.ADMIN_SERVICE.DELETE_SERVICE}?serviceId=${id}`);
};

export const setIsActiveService = async (id: string) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.TOGGLE_SERVICE_ACTIVE}?serviceId=${id}`);
};

export const fetchWorks = async (currentPage: number, pageSize: number) => {
    return await axios.get(`${API_ROUTES.ADMIN_SERVICE.FETCH_WORKS}?currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const fetchTopThree = async () => {
    const response = await axios.get(API_ROUTES.ADMIN_SERVICE.FETCH_TOP_THREE_WORKS);
    return response.data.data;
};

export const fetchEarnings = async (filter: string) => {
    const response = await axios.get(`${API_ROUTES.ADMIN_SERVICE.FETCH_EARNINGS}?filter=${filter}`);
    return response.data.data;
};

export const fetchWallet = async () => {
    const response = await axios.get(API_ROUTES.ADMIN_SERVICE.FETCH_WALLET);
    return response.data.data;
};

export const addSubscriptionPlan = async (payload: {
    planName: string;
    description: string;
    amount: string;
    comission: string;
    durationInDays: string;
}) => {
    const response = await axios.post(API_ROUTES.ADMIN_SERVICE.CREATE_SUBSCRIPTION, payload);
    return response.data.data;
};

export const fetchSubscriptionPlans = async (currentPage: number, limit: number) => {
    const response = await axios.get(`${API_ROUTES.ADMIN_SERVICE.FETCH_SUBSCRIPTIONS}?currentPage=${currentPage}&limit=${limit}`);
    return response.data.data;
};

export const deleteSubscription = async (subscriptionId: string) => {
    const response = await axios.delete(`${API_ROUTES.ADMIN_SERVICE.DELETE_SUBSCRIPTION}?subscriptionId=${subscriptionId}`);
    return response.data.data;
};

export const toggleStatus = async (subscriptionId: string) => {
    const response = await axios.get(`${API_ROUTES.ADMIN_SERVICE.TOGGLE_SUBSCRIPTION_STATUS}?subscriptionId=${subscriptionId}`);
    return response.data.data;
};

export const updateSubscription = async (id: string, subscriptionData: Partial<ISubscription>) => {
    const response = await axios.post(`${API_ROUTES.ADMIN_SERVICE.UPDATE_SUBSCRIPTION}?subscriptionId=${id}`, subscriptionData);
    return response.data.data;
};