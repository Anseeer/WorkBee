import axios from "./axios"
import type { Iuser } from "../types/userTypes";


export const register = async (userData:Partial<Iuser>)=>{
    let response = await axios.post('users/register',userData);
    console.log("Response from the axios :",response)
    return response;
}

export const login = async (credintials:{email:string,password:string})=>{
    let response = await axios.post('users/login',credintials);
    return response;
}

export const forgotPassword = async(email:String)=>{
    let response = await axios.post('users/forgot-password',{email});
    return response;
}

export const resendOtp = async(email:String)=>{
    let response = await axios.post('users/resend-otp',{email});
    return response;
}

export const verifyOtp = async(email:String,otp:string)=>{
    let response = await axios.post('users/verify-otp',{email,otp});
    return response;
}

export const resetPass = async(email:String,password:string)=>{
    let response = await axios.post('users/reset-password',{email,password});
    return response;
}