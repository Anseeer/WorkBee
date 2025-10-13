import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { login } from "../services/adminService";
import type { Iuser } from "../types/IUser";

interface adminState {
    admin: Iuser | null,
    error: string | null;
    resetEmail: string | null;
}

const initialState: adminState = {
    admin: null,
    error: null,
    resetEmail: null,
}

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
        logout:(state)=>{
            state.admin = null;
            state.error = null;
            state.resetEmail = null;
        }
    },
    extraReducers: (build) => {
        build
            .addCase(loginAdminThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(loginAdminThunk.fulfilled, (state, action) => {
                state.error = null;
                state.admin = action.payload.admin;
            })
            .addCase(loginAdminThunk.rejected, (state, action) => {
                state.error = action.payload as string;
            })
    },
})
export default adminSlice.reducer;
export const { logout } = adminSlice.actions;
