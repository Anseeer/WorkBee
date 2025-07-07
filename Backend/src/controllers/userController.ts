import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { successResponse , errorResponse } from "../utilities/response";
import { Console } from "console";

export class UserController{
    private userService:UserService;
    constructor(userService:UserService){
        this.userService = userService
    }

    register = async (req:Request,res:Response)=>{
        try {
            console.log("Req:",req.body);
            
            let {newUser,token} = await this.userService.registerUser(req.body);
            let response = new successResponse(201,'User Registration SuccessFull',{newUser,token});
            res.status(response.status).json(response);
        } catch (error:any) {
            let response = new errorResponse(400,'User Registration Faild',error.message);
            console.log("Error",response)
            res.status(response.status).json(response);
        }
    }

    login = async (req:Request,res:Response)=>{
       try {
        const {email,password} = req.body;
        console.log("req.boady",{email,password})
        const {user,token} = await this.userService.loginUser(email,password);
        console.log("loginUser :",{user,token});
        const response = new successResponse(201,'SuccessFully Login',{user,token});
        console.log("response :",response)
        res.status(response.status).json(response);
       } catch (error:any) {
        const response = new errorResponse(400,'Faild To Login',error.message);
        res.status(response.status).json(response);
       }
    }

    forgotPass = async(req:Request,res:Response)=>{
        try {
            const {email} = req.body;
            const user = await this.userService.getUserByEmail(email);
            console.log("Email :",email);
            if(!user){
                throw new Error(" Cant find the user");
                return;
            }
            let otp = await this.userService.forgotPass(email)
            console.log("OTP :",otp);
            const response = new successResponse(201,'SuccessFully send otp',{otp,email});
            console.log("Response :",response);
            res.status(response.status).json(response);
        } catch (error:any) {
        const response = new errorResponse(400,'Faild To Send OTP',error.message);
        res.status(response.status).json(response);
        }
    }

    resendOtp = async(req:Request,res:Response)=>{
    try {
    const {email} = req.body;
    const user = await this.userService.getUserByEmail(email);
    if(!user){
        throw new Error(" Cant find the user");
        return;
    }
    const otp = await this.userService.resendOtp(email);
    const response = new successResponse(201,"Successfully resend otp",{otp});
    res.status(response.status).json(response);
    } catch (error:any) {
        const response = new errorResponse(400,'Faild To Resend',error.message);
        res.status(response.status).json(response);
        }
    }

    verifyOtp = async(req:Request,res:Response)=>{
        try {
            const {email,otp} = req.body;
            await this.userService.verifyOtp(email,otp);
            let response = new successResponse(201,'Verified',{});
            res.status(response.status).json(response);
        } catch (error:any) {
        const response = new errorResponse(400,'Verification Faild',error.message);
        res.status(response.status).json(response);
        }
    }

    resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
        throw new Error('Email and password are required');
        }

        const user = await this.userService.getUserByEmail(email);
        if (!user) {
        throw new Error('User not found with the given email');
        }

        await this.userService.resetPass(email, password);

        const response = new successResponse(200, 'Password reset successfully',{});
        res.status(response.status).json(response);

    } catch (error: any) {
        const response = new errorResponse(400, 'Failed to reset password', error.message);
        res.status(response.status).json(response);
    }
    };

    
}