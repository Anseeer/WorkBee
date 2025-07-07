import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Iuser } from "../types/userTypes";
import { forgotPassword, login, register, resendOtp, resetPass, verifyOtp } from "../services/user.services";

interface userState{
    user:Iuser|null,
    error:string|null;
    resetEmail:string|null;
    token:string|null;
}

const initialState : userState = {
    user:null,
    error:null,
    resetEmail:null,
    token:null
}


export const registerUserThunk = createAsyncThunk("users/register",
    async(userData:Iuser,{ rejectWithValue })=>{
        try {
            let response = await register(userData);
            console.log("response.data :",response.data)
            return response.data.data;
        } catch (error:any) {
        return rejectWithValue(error.response?.data.data);
        }
    }
)

export const loginUserThunk = createAsyncThunk("users/login",
    async(credintials:{email:string,password:string},{ rejectWithValue })=>{
        try {
            let response = await login(credintials);
            return response.data.data;
        } catch (error:any) {
            return rejectWithValue(error.response.data.data)
        }
    }
)

export const forgotPassUserThunk = createAsyncThunk("user/forgot-password",
    async(email:string,{rejectWithValue})=>{
        try {
            let response = await forgotPassword(email);
            console.log("response :",response);
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.response.data.data)
        }
    }
)

export const resendOtpUserThunk = createAsyncThunk("user/otp-resend",
    async(email:string,{rejectWithValue})=>{
        try {
            let response = await resendOtp(email);
            console.log("response :",response);
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.response.data.data)
        }
    }
)

export const verifyOtpUserThunk = createAsyncThunk("user/verify-otp",
    async(verifyData:{email:string,otp:string},{rejectWithValue})=>{
        try {
            let response = await verifyOtp(verifyData.email,verifyData.otp)
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.response.data.data)
        }
    }
)

export const resetPasswordUserThunk = createAsyncThunk("users/reset-password",
    async(resetData:{email:string,password:string},{rejectWithValue})=>{
        try {
            let response = await resetPass(resetData.email,resetData.password)
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.response.data.data)
        }
    }
)

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        logout:(state:userState)=>{
            state.user = null;
            state.error = null;
        },
        setTokenFromStorage(state,action){
            state.token = action.payload
        },
    }, 
    extraReducers:(builder)=>{
        builder
        .addCase(registerUserThunk.pending,(state)=>{
            state.error = null;
        })
        .addCase(registerUserThunk.fulfilled,(state,action)=>{
            state.user = action.payload.newUser;
            state.token = action.payload.token;
            state.error = null;
            console.log("Updated state:", JSON.parse(JSON.stringify(state)));
        })
        .addCase(registerUserThunk.rejected,(state,action)=>{
            state.error = action.payload as string ;
            
        })
        .addCase(loginUserThunk.pending,(state)=>{
            state.error = null;
        })
        .addCase(loginUserThunk.fulfilled,(state,action)=>{
           state.error = null;
           state.user = action.payload.user;
           state.token = action.payload.token;
           console.log("Updated state:", JSON.parse(JSON.stringify(state)));
        })
        .addCase(loginUserThunk.rejected,(state,action)=>{
            state.error = action.payload as string
        })
    }
})

export const {logout , setTokenFromStorage} = userSlice.actions;
export default userSlice.reducer;