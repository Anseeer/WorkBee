import type { IAdmin } from "../types/IAdmin";
import axios from "./axios";

export const register = async (adminData: IAdmin) => {
    const response = await axios.post("admins/register", adminData);
    return response;
};

export const login = async (credentials: { email: string, password: string }) => {
    const response = await axios.post("admins/login", credentials);
    return response;
}

export const forgotPassword = async (email: string) => {
    const response = await axios.post('admins/forgot-password', { email });
    return response;
}

export const resendOtp = async (email: string) => {
    const response = await axios.post('admins/resend-otp', { email });
    return response;
}

export const verifyOtp = async (email: string, otp: string) => {
    const response = await axios.post('admins/verify-otp', { email, otp });
    return response;
}

export const resetPass = async (email: string, password: string) => {
    const response = await axios.post('admins/reset-password', { email, password });
    return response;
}