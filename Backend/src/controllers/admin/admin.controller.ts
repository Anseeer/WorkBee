import { Request, Response } from "express";
import { AdminService } from "../../services/admin/admin.service";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { IAdminController } from "./admin.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";

@injectable()
export class AdminController implements IAdminController {
    private _adminService: AdminService;
    constructor(@inject(TYPES.adminService) adminService: AdminService) {
        this._adminService = adminService;
    }

    register = async (req: Request, res: Response) => {
        try {
            const { name, email, password, phone } = req.body;
            if (!name || !email || !password || !phone) {
                throw new Error("Some fields are missing");
            }
            const { token, admin } = await this._adminService.register(req.body);
            const response = new successResponse(201, "Admin Registration Successfull", { token, admin });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Registration Faild", errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error("Email and Password are required !");
            }
            const { token, admin } = await this._adminService.login(req.body);
            const response = new successResponse(200, "Admin Login Successfull", { token, admin });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Login Faild", errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }


    forgotPass = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this._adminService.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this._adminService.forgotPass(email)
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
            const user = await this._adminService.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this._adminService.resendOtp(email);
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
            await this._adminService.verifyOtp(email, otp);
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
            const user = await this._adminService.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found with the given email');
            }
            await this._adminService.resetPass(email, password);
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