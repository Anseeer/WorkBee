import axios from "./axios"
import type { Iuser } from "../types/IUser";
import type { IWork } from "../types/IWork";


export const register = async (userData: Partial<Iuser>) => {
    const response = await axios.post('users/register', userData, { withCredentials: true });
    console.log("Response from the axios :", response)
    return response;
}

export const login = async (credintials: { email: string, password: string }) => {
    const response = await axios.post('users/login', credintials, { withCredentials: true });
    return response;
}

export const fetchUser = async (userId?: string) => {
    const response = await axios.get(`users/fetch-data?userId=${userId}`);
    return response.data;
}

export const logoutUser = async () => {
    await axios.post('users/logout', {}, { withCredentials: true });
};

export const forgotPassword = async (email: string) => {
    const response = await axios.post('users/forgot-password', { email });
    return response;
}

export const resendOtp = async (email: string) => {
    const response = await axios.post('users/resend-otp', { email });
    return response;
}

export const verifyOtp = async (email: string, otp: string) => {
    const response = await axios.post('users/verify-otp', { email, otp });
    return response;
}

export const resetPass = async (email: string, password: string) => {
    const response = await axios.post('users/reset-password', { email, password });
    return response;
}

export const fetchService = async () => {
    const response = await axios.get(`services/getAll-services?currentPage=${1}&pageSize=${1000}`);
    return response;
}

export const fetchServiceBySearchTerm = async (searchKey: string) => {
    return await axios.post('services/by-search', { search: searchKey });
};


export const fetchAvailability = async (id: string | null) => {
    if (!id) {
        throw new Error("Worker Id Not Get")
    }
    const response = await axios.get(`users/fetch-availability?workerId=${id}`);
    return response;
}

export const fetchServiceById = async (id: string) => {
    console.log("ID",id);
    if (!id) {
        throw new Error('Service Id not get');
    }
    const response = await axios.post(`services/By-Id?id=${id}`);
    return response;
}

export const fetchCategoryById = async (id: string) => {
    if (!id) {
        throw new Error('Category Id not get');
    }
    const response = await axios.post(`categories/By-Id?id=${id}`);
    return response;
}

export const DraftWork = async (workDetails: IWork) => {
    if (!workDetails) {
        throw new Error("WorkDetails not get");
    }
    const response = await axios.post('works/creat-work', workDetails);
    return response;
}

export const fetchWorkHistory = async (userId: string, currentPage: number, pageSize: number) => {
    console.log("userId:", userId, "CurrentPage :", currentPage, "pageSize:", pageSize);
    const response = await axios.get(`works/users?userId=${userId}&currentPage=${currentPage}&pageSize=${pageSize}`);
    return response;
}

export const update = async (userDetails: Partial<Iuser>, userId: string) => {
    const response = await axios.put(`users/update`, { userDetails, userId });
    return response;
}

export const cancelWork = async (workId: string, id: string) => {
    await axios.patch(`works/cancel?workId=${workId}&id=${id}`);
    return;
}

export const getUserDetails = async (userId: string) => {
    const response = await axios.get(`users/fetch-data?userId=${userId}`);
    return response.data.data;
}

export const findUsersByIds = async (userIds: string[]) => {
    const response = await axios.post(`users/find-users-byId`, { userIds });
    return response.data.data;
}

export const fetchChat = async (userId: string) => {
    const response = await axios.get(`chats/fetch-chat?userId=${userId}`);
    return response.data.data;
}

export const rateWorker = async (workerId: string, rating: number) => {
    const response = await axios.get(`workers/ratings?workerId=${workerId}&rating=${rating}`)
    return response.data.data;
}