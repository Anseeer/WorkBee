import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IWorker } from "../types/IWorker";
import { forgotPassword, login, register, resendOtp, resetPass, verifyOtp } from "../services/workerService";
import type { AxiosError } from "axios";


interface userState {
    worker: Partial<IWorker> | null,
    error: string | null;
}

const initialState: userState = {
    worker: null,
    error: null,
}


export const registerWorkerThunk = createAsyncThunk(
    "workers/register",
    async (workerData: Partial<IWorker>, { rejectWithValue }) => {
        console.log("WorkerData :", workerData)
        try {
            const response = await register(workerData);
            console.log("REsponse from thunk", response.data.data)
            return response.data.data;
        } catch (error: unknown) {
            const err = error as AxiosError<{ data: string }>;
            const errMsg = err || "Unknown error";
            return rejectWithValue(errMsg);
        }
    }
);

export const loginWorkerThunk = createAsyncThunk(
    "workers/login",
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


export const forgotPassUserThunk = createAsyncThunk("workers/forgot-password",
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

export const resendOtpUserThunk = createAsyncThunk("workers/otp-resend",
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

export const verifyOtpUserThunk = createAsyncThunk("workers/verify-otp",
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

export const resetPasswordUserThunk = createAsyncThunk("workers/reset-password",
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



const workerSlice = createSlice({
    name: "worker",
    initialState,
    reducers: {
        logout: (state) => {
            state.error = null;
            state.worker = null;
        }
    },
    extraReducers: (build) => {
        build
            .addCase(registerWorkerThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(registerWorkerThunk.fulfilled, (state, action) => {
                state.error = null;
                state.worker = action.payload?.worker;

            })
            .addCase(registerWorkerThunk.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(loginWorkerThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(loginWorkerThunk.fulfilled, (state, action) => {
                state.error = null;
                state.worker = action.payload.worker;
            })
            .addCase(loginWorkerThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
    }
})

export const { logout } = workerSlice.actions;

export default workerSlice.reducer;