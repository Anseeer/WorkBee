import axios from "./axios"
import type { Iuser } from "../types/IUser";
import type { IWork } from "../types/IWork";
import { API_ROUTES } from "../constant/api.routes";
import { getProfileImage } from "../utilities/getProfile";


export const register = async (userData: Partial<Iuser>) => {
    userData.profileImage = getProfileImage(userData.name);
    const response = await axios.post(API_ROUTES.USER_SERVICE.REGISTER, userData, {
        withCredentials: true,
    });
    console.log('Response from axios:', response);
    return response;
};

export const login = async (credentials: { email: string; password: string }) => {
    const response = await axios.post(API_ROUTES.USER_SERVICE.LOGIN, credentials, {
        withCredentials: true,
    });
    return response;
};

export const logoutUser = async () => {
    await axios.post(API_ROUTES.USER_SERVICE.LOGOUT, {}, { withCredentials: true });
};

export const forgotPassword = async (email: string) => {
    const response = await axios.post(API_ROUTES.USER_SERVICE.FORGOT_PASSWORD, { email });
    return response;
};

export const resendOtp = async (email: string) => {
    const response = await axios.post(API_ROUTES.USER_SERVICE.RESEND_OTP, { email });
    return response;
};

export const verifyOtp = async (email: string, otp: string) => {
    const response = await axios.post(API_ROUTES.USER_SERVICE.VERIFY_OTP, { email, otp });
    return response;
};

export const resetPass = async (email: string, password: string) => {
    const response = await axios.post(API_ROUTES.USER_SERVICE.RESET_PASSWORD, { email, password });
    return response;
};


export const fetchUser = async (userId?: string) => {
    const response = await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_DATA}?userId=${userId}`);
    return response.data;
};

export const getUserDetails = async (userId: string) => {
    const response = await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_DATA}?userId=${userId}`);
    return response.data.data;
};

export const update = async (userDetails: Partial<Iuser>, userId: string) => {
    const response = await axios.put(API_ROUTES.USER_SERVICE.UPDATE, { userDetails, userId });
    return response;
};

export const findUsersByIds = async (userIds: string[]) => {
    const response = await axios.post(API_ROUTES.USER_SERVICE.FIND_BY_IDS, { userIds });
    return response.data.data;
};

export const fetchAvailability = async (id: string | null) => {
    if (!id) throw new Error('Worker Id not provided');
    const response = await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_AVAILABILITY}?workerId=${id}`);
    return response;
};

export const fetchService = async () => {
    const response = await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_SERVICES}?currentPage=1&pageSize=1000`);
    return response;
};

export const fetchServiceBySearchTerm = async (searchKey: string) => {
    const response = await axios.post(API_ROUTES.USER_SERVICE.FETCH_SERVICE_BY_SEARCH, { search: searchKey });
    return response;
};

export const fetchServiceById = async (id: string) => {
    if (!id) throw new Error('Service Id not provided');
    const response = await axios.post(`${API_ROUTES.USER_SERVICE.FETCH_SERVICE_BY_ID}?id=${id}`);
    return response;
};


export const fetchCategoryById = async (id: string) => {
    if (!id) throw new Error('Category Id not provided');
    const response = await axios.post(`${API_ROUTES.USER_SERVICE.FETCH_CATEGORY_BY_ID}?id=${id}`);
    return response;
};


export const DraftWork = async (workDetails: IWork) => {
    if (!workDetails) throw new Error('Work details not provided');
    const response = await axios.post(API_ROUTES.USER_SERVICE.CREATE_WORK, workDetails);
    return response;
};

export const fetchWorkHistory = async (
    userId: string,
    currentPage: number,
    pageSize: number
) => {
    console.log('userId:', userId, 'CurrentPage:', currentPage, 'pageSize:', pageSize);
    const response = await axios.get(
        `${API_ROUTES.USER_SERVICE.FETCH_WORK_HISTORY}?userId=${userId}&currentPage=${currentPage}&pageSize=${pageSize}`
    );
    return response;
};

export const cancelWork = async (workId: string, id: string) => {
    await axios.patch(`${API_ROUTES.USER_SERVICE.CANCEL_WORK}?workId=${workId}&id=${id}`);
};

export const fetchChat = async (userId: string) => {
    const response = await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_CHAT}?userId=${userId}`);
    return response.data.data;
};

export const rateWorker = async (workerId: string, rating: number) => {
    const response = await axios.get(`${API_ROUTES.USER_SERVICE.RATE_WORKER}?workerId=${workerId}&rating=${rating}`);
    return response.data.data;
};

export const fetchTopService = async (limit: number) => {
    const response = await axios.get(`${API_ROUTES.USER_SERVICE.FETCH_TOP_SERVICES}?limit=${limit}`);
    return response.data.data.getTopService;
};