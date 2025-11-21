import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Iuser } from "../types/IUser";
import { fetchUser, forgotPassword, login, register, resendOtp, resetPass, reVerify, verifyOtp, verifyRegister } from "../services/userService";
import type { AxiosError } from "axios";
import type { IWallet } from "../types/IWallet";
import { API_ROUTES } from "../constant/api.routes";

interface userState {
    wallet: IWallet | null;
    user: Iuser | null,
    error: string | null;
    wallet: IWallet | null;
    resetEmail: string | null;
}

const initialState: userState = {
    user: null,
    error: null,
    wallet: null,
    resetEmail: null,
}

export const registerUserThunk = createAsyncThunk(
    API_ROUTES.USER_SERVICE.REGISTER,
    async (userData: Partial<Iuser>, { rejectWithValue }) => {
        try {
            const response = await register(userData);
            localStorage.setItem('temp_userId', response?.data?.data?.userId);
            return response.data.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

export const verifyRegisterUserThunk = createAsyncThunk(
    API_ROUTES.USER_SERVICE.VERIFY_REGISTRATION,
    async (verifyData: { userId: string, otp: string }, { rejectWithValue }) => {
        try {
            const response = await verifyRegister(verifyData);
            console.log("response.data :", response.data)
            return response.data.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            console.log("err response.data :", error.response?.data)
            const errorMessage = error.response?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

export const loginUserThunk = createAsyncThunk(
    API_ROUTES.USER.LOGIN,
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

export const forgotPassUserThunk = createAsyncThunk(
    API_ROUTES.USER.FORGOT_PASS,
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

export const resendOtpUserThunk = createAsyncThunk(
    API_ROUTES.USER.RESEND_OTP,
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

export const reVerifyRegister = createAsyncThunk(
    API_ROUTES.USER_SERVICE.REVERIFY_REGISTER,
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await reVerify(userId);
            console.log("response :", response);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error.response?.data?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

export const verifyOtpUserThunk = createAsyncThunk(
    API_ROUTES.USER.VERIFY_OTP,
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

export const resetPasswordUserThunk = createAsyncThunk(
    API_ROUTES.USER.RESET_PASS,
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

export const fetchUserDataThunk = createAsyncThunk(
    API_ROUTES.USER.FETCH_DATA,
    async (_, { rejectWithValue }) => {
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
        googleLoginSuccess: (state, action) => {
            console.log("user ::", action.payload.user)
            state.user = action.payload.user;
            state.wallet = action.payload.wallet;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyRegisterUserThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(verifyRegisterUserThunk.fulfilled, (state, action) => {
                state.user = action.payload.newUser;
                state.wallet = action.payload.wallet;
                state.error = null;
            })
            .addCase(verifyRegisterUserThunk.rejected, (state, action) => {
                state.error = action.payload as string;

            })
            .addCase(loginUserThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.error = null;
                state.user = action.payload.user;
                state.wallet = action.payload.wallet;
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(fetchUserDataThunk.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.wallet = action.payload.wallet;
            })
            .addCase(fetchUserDataThunk.rejected, (state) => {
                state.user = null;
            })

    }
})

export const { logout, googleLoginSuccess } = userSlice.actions;
export default userSlice.reducer;