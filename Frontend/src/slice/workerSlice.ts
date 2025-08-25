import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { buildAccount, fetchData, forgotPassword, getWorkerDetails, login, register, resendOtp, resetPass, verifyOtp } from "../services/workerService";
import type { IWorker } from "../types/IWorker";
import type { IAvailability } from "../types/IAvailability";
import type { IWallet } from "../types/IWallet";

interface BuildAccountResponse {
    worker: IWorker;
    availability: IAvailability;
    wallet: IWallet;
}


export interface WorkerState {
    worker: IWorker | null;
    availability: IAvailability | null;
    wallet: IWallet | null;
    error: string | null;
}

const initialState: WorkerState = {
    worker: null,
    availability: null,
    wallet: null,
    error: null,
};

export const registerWorkerThunk = createAsyncThunk(
    "workers/register",
    async (workerData: Partial<IWorker>, { rejectWithValue }) => {
        try {
            const response = await register(workerData);
            return response.data.data
        } catch (error: unknown) {
            const err = error as AxiosError<{ data: string }>;
            return rejectWithValue(err.response?.data?.data || "Registration failed");
        }
    }
);

export const loginWorkerThunk = createAsyncThunk(
    "workers/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            return response.data.data
        } catch (error: unknown) {
            const err = error as AxiosError<{ data: string }>;
            return rejectWithValue(err.response?.data?.data || "Login failed");
        }
    }
);

export const forgotPassUserThunk = createAsyncThunk(
    "workers/forgot-password",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await forgotPassword(email);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            return rejectWithValue(error.response?.data?.data || "Something went wrong");
        }
    }
);

export const resendOtpUserThunk = createAsyncThunk(
    "workers/otp-resend",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await resendOtp(email);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            return rejectWithValue(error.response?.data?.data || "Something went wrong");
        }
    }
);

export const verifyOtpUserThunk = createAsyncThunk(
    "workers/verify-otp",
    async (verifyData: { email: string; otp: string }, { rejectWithValue }) => {
        try {
            const response = await verifyOtp(verifyData.email, verifyData.otp);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            return rejectWithValue(error.response?.data?.data || "Something went wrong");
        }
    }
);

export const resetPasswordUserThunk = createAsyncThunk(
    "workers/reset-password",
    async (resetData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await resetPass(resetData.email, resetData.password);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            return rejectWithValue(error.response?.data?.data || "Something went wrong");
        }
    }
);

export const buildAccountWorkerThunk = createAsyncThunk(
    "workers/build-account",
    async (accountData: Partial<IWorker>, { rejectWithValue }) => {
        try {
            console.log("WorkerId :", accountData._id)
            const response = await buildAccount(accountData._id, accountData);
            return response.data.data as BuildAccountResponse;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            return rejectWithValue(error);
        }
    }
);


export const fetchWorkerDetails = createAsyncThunk(
    "workers/fetch-details",
    async (workerId: string, { rejectWithValue }) => {
        try {
            console.log("Getting the worker id from localStorage:", workerId);
            const response = await getWorkerDetails(workerId);
            return response.data.data as BuildAccountResponse;
        } catch (error: unknown) {
            const err = error as AxiosError<{ data: string }>;
            return rejectWithValue(err.response?.data?.data || "Failed to fetch worker");
        }
    }
);


export const fetchWorkerDataThunk = createAsyncThunk("workers/fetch-data",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchData()
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
        },
        googleLoginSuccess: (state, action) => {
            const worker = action.payload.worker;
            const wallet = action.payload.wallet;
            state.worker = {
                ...worker,
                id: worker.id || worker._id
            };
            state.wallet = wallet;
            state.availability = action.payload.availability;
            state.error = null;
            localStorage.setItem("workerId", state.worker?.id as string);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerWorkerThunk.fulfilled, (state, action) => {
                const worker = action.payload.worker;
                const wallet = action.payload.wallet;

                state.worker = {
                    ...worker,
                    id: worker._id || worker.id
                };
                state.error = null;
                state.wallet = wallet;
                localStorage.setItem("workerId", state.worker?.id as string);
            })

            .addCase(registerWorkerThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(loginWorkerThunk.fulfilled, (state, action) => {
                console.log("Action.Payload :", action.payload)
                const worker = action.payload.worker;
                const wallet = action.payload.wallet;
                const availability = action.payload.availability;
                console.log("Worker :", worker)
                console.log("Availability :", availability)
                state.worker = {
                    ...worker,
                    id: worker.id || worker._id
                };
                state.wallet = wallet;
                state.error = null;
                localStorage.setItem("workerId", state.worker?.id as string);
            })

            .addCase(loginWorkerThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(buildAccountWorkerThunk.fulfilled, (state, action) => {
                state.worker = action.payload.worker;
                state.availability = action.payload.availability
                state.error = null;
            })
            .addCase(buildAccountWorkerThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(fetchWorkerDetails.fulfilled, (state, action) => {
                state.worker = action.payload.worker;
                state.wallet = action.payload.wallet;
                state.availability = action.payload.availability;
            })
            .addCase(fetchWorkerDataThunk.fulfilled, (state, action) => {
                state.worker = action.payload.worker;
                state.wallet = action.payload.wallet;
                state.availability = action.payload.availability;
            })
            .addCase(fetchWorkerDataThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
    },
});

export const { logout, googleLoginSuccess } = workerSlice.actions;
export default workerSlice.reducer;
