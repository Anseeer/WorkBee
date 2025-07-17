import { Request, Response } from "express";
import logger from "../../utilities/logger";
import { UserService } from "../../services/user/user.service";
import { errorResponse, successResponse } from "../../utilities/response";
import { IUserController } from "./user.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";

@injectable()
export class UserController implements IUserController {
    private _userService: UserService;
    constructor(@inject(TYPES.userService)userService: UserService) {
        this._userService = userService
    }

    register = async (req: Request, res: Response) => {
        try {
            const { user, token } = await this._userService.registerUser(req.body);
            const response = new successResponse(201, 'User Registration SuccessFull', { user, token });
            logger.info(response);
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
            const { user, token } = await this._userService.loginUser(email, password);
            const response = new successResponse(201, 'SuccessFully Login', { user, token });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Login', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    forgotPass = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this._userService.forgotPass(email)
            logger.info("OTP :", otp);
            const response = new successResponse(201, 'SuccessFully send otp', { otp, email });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Send OTP', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    resendOtp = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this._userService.resendOtp(email);
            const response = new successResponse(201, "Successfully resend otp", { otp });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Resend', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    verifyOtp = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            await this._userService.verifyOtp(email, otp);
            const response = new successResponse(201, 'Verified', {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Failed to verify otp', message);
            logger.error(response)
            res.status(response.status).json(response);
        }

    }

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found with the given email');
            }
            await this._userService.resetPass(email, password);
            const response = new successResponse(200, 'Password reset successfully', {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Failed to reset password', message);
            logger.error(response)
            res.status(response.status).json(response);
        }

    };

}