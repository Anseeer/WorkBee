import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { buildAccount, forgotPassword, getWorkerDetails, login, register, resendOtp, resetPass, verifyOtp } from "../services/workerService";
import type { IWorker } from "../types/IWorker";
import type { IAvailability } from "../types/IAvailability";

interface BuildAccountResponse {
    worker: IWorker;
    availability: IAvailability;
}


export interface WorkerState {
    worker: IWorker | null;
    availability: IAvailability | null;
    error: string | null;
}

const initialState: WorkerState = {
    worker: null,
    availability: null,
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


const workerSlice = createSlice({
    name: "worker",
    initialState,
    reducers: {
        logout: (state) => {
            state.error = null;
            state.worker = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerWorkerThunk.fulfilled, (state, action) => {
                const worker = action.payload.worker;

                state.worker = {
                    ...worker,
                    id: worker._id || worker.id
                };
                state.error = null;
                localStorage.setItem("workerId", state.worker?.id as string);
            })

            .addCase(registerWorkerThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            // Login
            .addCase(loginWorkerThunk.fulfilled, (state, action) => {
                console.log("Action.Payload :",action.payload)
                const worker = action.payload.worker;
                const availability = action.payload.availability;
                console.log("Worker :",worker)
                console.log("Availability :",availability)
                state.worker = {
                    ...worker,
                    id: worker.id || worker._id
                };
                state.error = null;
                localStorage.setItem("workerId", state.worker?.id as string);
            })

            .addCase(loginWorkerThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            // Build Account
            .addCase(buildAccountWorkerThunk.fulfilled, (state, action) => {
                console.log("Build Account payload :", action.payload)
                console.log("Build Account worker :", action.payload.worker)
                console.log("Build Account availalblity :", action.payload.availability)
                state.worker = action.payload.worker;
                state.availability = action.payload.availability
                state.error = null;
            })
            .addCase(buildAccountWorkerThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(fetchWorkerDetails.fulfilled,(state,action)=>{
                console.log("PAyload in the fetchWorker :",action.payload)
                console.log("PAyload.worker in the fetchWorker :",action.payload.worker)
                console.log("PAyload.availability in the fetchWorker :",action.payload.availability)
                state.worker = action.payload.worker;
                state.availability = action.payload.availability;
            })
    },
});

export const { logout } = workerSlice.actions;
export default workerSlice.reducer;
