import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utilities/response";
import { userUsecase } from "../usecase/user";
import logger from "../utilities/logger";

export class UserController {
    private userUsecase: userUsecase;
    constructor(userUsecase: userUsecase) {
        this.userUsecase = userUsecase
    }

    register = async (req: Request, res: Response) => {
        try {
            const { user, token } = await this.userUsecase.registerUser(req.body);
            const response = new successResponse(201, 'User Registration SuccessFull', { user, token });
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'User Registration Faild', message);
            logger.error("Error", response)
            res.status(response.status).json(response);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.userUsecase.loginUser(email, password);
            const response = new successResponse(201, 'SuccessFully Login', { user, token });
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Login', message);
            res.status(response.status).json(response);
        }
    }

    forgotPass = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this.userUsecase.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this.userUsecase.forgotPass(email)
            logger.info("OTP :", otp);
            const response = new successResponse(201, 'SuccessFully send otp', { otp, email });
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Send OTP', message);
            res.status(response.status).json(response);
        }
    }

    resendOtp = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this.userUsecase.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this.userUsecase.resendOtp(email);
            const response = new successResponse(201, "Successfully resend otp", { otp });
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Resend', message);
            res.status(response.status).json(response);
        }
    }

    verifyOtp = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            await this.userUsecase.verifyOtp(email, otp);
            const response = new successResponse(201, 'Verified', {});
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Failed to verify otp', message);
            res.status(response.status).json(response);
        }

    }

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const user = await this.userUsecase.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found with the given email');
            }

            await this.userUsecase.resetPass(email, password);

            const response = new successResponse(200, 'Password reset successfully', {});
            res.status(response.status).json(response);

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Failed to reset password', message);
            res.status(response.status).json(response);
        }

    };


}