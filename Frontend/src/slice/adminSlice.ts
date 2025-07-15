import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IAdmin } from "../types/IAdmin";
import type { AxiosError } from "axios";
import { forgotPassword, login, register, resendOtp, resetPass, verifyOtp } from "../services/adminService";


interface adminState {
    admin: IAdmin | null,
    error: string | null;
    resetEmail: string | null;
    token: string | null;
}

const initialState: adminState = {
    admin: null,
    error: null,
    resetEmail: null,
    token: null
}

export const registerAdminThunk = createAsyncThunk(
    "admins/register",
    async (adminData: IAdmin, { rejectWithValue }) => {
        console.log("AdminData :", adminData)
        try {
            const response = await register(adminData);
            console.log("REsponse from thunk", response.data.data)
            return response.data.data;
        } catch (error: unknown) {
            const err = error as AxiosError<{ data: string }>;
            const errMsg = err.response?.data.data || "Unknown error";
            return rejectWithValue(errMsg);
        }
    }
);



export const forgotPassUserThunk = createAsyncThunk("admins/forgot-password",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await forgotPassword(email);
            console.log("response :", response);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error.response?.data?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

export const resendOtpUserThunk = createAsyncThunk("admins/otp-resend",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await resendOtp(email);
            console.log("response :", response);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error.response?.data?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

export const verifyOtpUserThunk = createAsyncThunk("admins/verify-otp",
    async (verifyData: { email: string, otp: string }, { rejectWithValue }) => {
        try {
            const response = await verifyOtp(verifyData.email, verifyData.otp)
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error.response?.data?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

export const resetPasswordUserThunk = createAsyncThunk("admins/reset-password",
    async (resetData: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await resetPass(resetData.email, resetData.password)
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error.response?.data?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)



export const loginAdminThunk = createAsyncThunk(
    "admins/login",
    async (credentials: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            return response.data.data
        } catch (error) {
            const err = error as AxiosError<{ data: string }>;
            const errMsg = err.response?.data.data || "Unknown error";
            return rejectWithValue(errMsg);
        }
    }
)

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {

    },
    extraReducers: (build) => {
        build
            .addCase(registerAdminThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(registerAdminThunk.fulfilled, (state, action) => {
                state.error = null;
                state.admin = action.payload?.admin;
                state.token = action.payload?.token;

            })
            .addCase(registerAdminThunk.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(loginAdminThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(loginAdminThunk.fulfilled, (state, action) => {
                state.error = null;
                state.token = action.payload.token;
                state.admin = action.payload.admin;
            })
            .addCase(loginAdminThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
    },
})

export default adminSlice.reducer;