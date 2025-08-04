import axios from "./axios"
import type { Iuser } from "../types/IUser";


export const register = async (userData: Partial<Iuser>) => {
    const response = await axios.post('users/register', userData, { withCredentials: true });
    console.log("Response from the axios :", response)
    return response;
}

export const login = async (credintials: { email: string, password: string }) => {
    const response = await axios.post('users/login', credintials, { withCredentials: true });
    return response;
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
    const response = await axios.get('services/getAll-services');
    return response;
}

export const fetchServiceBySearchTerm = async (searchKey: string) => {
    return await axios.post('services/by-search', { search: searchKey });
};
