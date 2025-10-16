import axios from "./axios"
import type { Iuser } from "../types/IUser";
import type { IWork } from "../types/IWork";
import { API_ROUTES } from "../constant/api.routes";


export const register = async (userData: Iuser) => {
    return await axios.post(API_ROUTES.USER_SERVICE.REGISTER, userData, { withCredentials: true });
};

export const login = async (credentials: { email: string; password: string }) => {
    return await axios.post(API_ROUTES.USER_SERVICE.LOGIN, credentials, { withCredentials: true });
};

export const logoutUser = async () => {
    return await axios.post(API_ROUTES.USER_SERVICE.LOGOUT, {}, { withCredentials: true });
};

export const fetchUser = async (userId: string) => {
    return await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_USER}?userId=${userId}`);
};

export const forgotPassword = async (email: string) => {
    return await axios.post(API_ROUTES.USER_SERVICE.FORGOT_PASSWORD, { email });
};

export const resendOtp = async (email: string) => {
    return await axios.post(API_ROUTES.USER_SERVICE.RESEND_OTP, { email });
};

export const verifyOtp = async (email: string, otp: string) => {
    return await axios.post(API_ROUTES.USER_SERVICE.VERIFY_OTP, { email, otp });
};

export const resetPass = async (email: string, password: string) => {
    return await axios.post(API_ROUTES.USER_SERVICE.RESET_PASSWORD, { email, password });
};

export const fetchService = async (currentPage = 1, pageSize = 1000) => {
    return await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_SERVICES}?currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const fetchServiceBySearchTerm = async (searchKey: string) => {
    return await axios.post(API_ROUTES.USER_SERVICE.FETCH_SERVICE_BY_SEARCH, { search: searchKey });
};

export const fetchServiceById = async (id: string) => {
    return await axios.post(`${API_ROUTES.USER_SERVICE.FETCH_SERVICE_BY_ID}?id=${id}`);
};

export const fetchCategoryById = async (id: string) => {
    return await axios.post(`${API_ROUTES.USER_SERVICE.FETCH_CATEGORY_BY_ID}?id=${id}`);
};

export const fetchAvailability = async (workerId: string) => {
    return await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_AVAILABILITY}?workerId=${workerId}`);
};

export const createWork = async (workDetails: IWork) => {
    return await axios.post(API_ROUTES.USER_SERVICE.CREATE_WORK, workDetails);
};

export const fetchWorkHistory = async (userId: string, currentPage: number, pageSize: number) => {
    return await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_WORK_HISTORY}?userId=${userId}&currentPage=${currentPage}&pageSize=${pageSize}`);
};

export const cancelWork = async (workId: string, id: string) => {
    return await axios.patch(`${API_ROUTES.USER_SERVICE.CANCEL_WORK}?workId=${workId}&id=${id}`);
};

export const findUsersByIds = async (userIds: string[]) => {
    return await axios.post(API_ROUTES.USER_SERVICE.FIND_USERS_BY_IDS, { userIds });
};

export const fetchChat = async (userId: string) => {
    return await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_CHAT}?userId=${userId}`);
};

export const rateWorker = async (workerId: string, rating: number) => {
    return await axios.get(`${API_ROUTES.USER_SERVICE.RATE_WORKER}?workerId=${workerId}&rating=${rating}`);
};