import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Iuser } from "../types/IUser";
import { fetchUser, forgotPassword, login, register, resendOtp, resetPass, verifyOtp } from "../services/userService";
import type { AxiosError } from "axios";

interface userState {
    user: Iuser | null,
    error: string | null;
    resetEmail: string | null;
}

const initialState: userState = {
    user: null,
    error: null,
    resetEmail: null,
}

export const registerUserThunk = createAsyncThunk("users/register",
    async (userData: Partial<Iuser>, { rejectWithValue }) => {
        try {
            const response = await register(userData);
            console.log("response.data :", response.data)
            return response.data.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

export const loginUserThunk = createAsyncThunk("users/login",
    async (credintials: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await login(credintials);
            return response.data.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error.response?.data?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

export const forgotPassUserThunk = createAsyncThunk("user/forgot-password",
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

export const resendOtpUserThunk = createAsyncThunk("user/otp-resend",
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

export const verifyOtpUserThunk = createAsyncThunk("user/verify-otp",
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

export const resetPasswordUserThunk = createAsyncThunk("users/reset-password",
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

export const fetchUserDataThunk = createAsyncThunk("users/fetch-data",
    async (_,{ rejectWithValue }) => {
        try {
            const response = await fetchUser()
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error.response?.data?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state: userState) => {
            state.user = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUserThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.user = action.payload.newUser;
                state.error = null;
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.error = action.payload as string;

            })
            .addCase(loginUserThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.error = null;
                state.user = action.payload.user;
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(fetchUserDataThunk.fulfilled,(state,action)=>{
                state.user = action.payload.user;
            })
            .addCase(fetchUserDataThunk.rejected,(state)=>{
                state.user = null;
            })
            
    }
})

export const { logout } = userSlice.actions;
export default userSlice.reducer;