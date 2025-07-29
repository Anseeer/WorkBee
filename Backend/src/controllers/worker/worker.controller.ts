import { Request, Response } from "express";
import { WorkerService } from "../../services/worker/worker.service";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { IWorkerController } from "./worker.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";

@injectable()
export class WorkerController implements IWorkerController {
    private _workerService: WorkerService;
    constructor(@inject(TYPES.workerService) workerService: WorkerService) {
        this._workerService = workerService
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error("Email and Password are required");
            }
            const credentials = { email, password };
            const { token, worker } = await this._workerService.loginWorker(credentials);
            const response = new successResponse(201, "Login Successfull", { worker });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            })
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Login Faild", errMsg);
            logger.error(response)
            res.status(response.status).json(response);
        }
    }

    register = async (req: Request, res: Response) => {
        try {
            console.log("Registering Worker:", req.body);
            const { token, workerId, role } = await this._workerService.registerWorker(req.body);
            const response = new successResponse(201, "Worker registration successful", {
                workerId,
                role
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            })
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Failed to register worker", errMsg);
            console.log(response)
            logger.error(response);
            res.status(response.status).json(response);
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Logout Failed", errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


    createAccount = async (req: Request, res: Response) => {
        const { workerId } = req.query;
        try {
            if (!workerId || typeof workerId !== "string") {
                throw new Error("Worker ID is missing or invalid");
            }
            const { availability, ...workerData } = req.body;
            const result = await this._workerService.createWorker(workerId, availability, workerData);
            const response = new successResponse(201, "Worker Account Build Successfully", {
                workerId: result.workerId
            });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const err = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Failed To Build Account", err);
            logger.error(response)
            res.status(response.status).json(response);
        }
    }

    forgotPass = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this._workerService.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this._workerService.forgotPass(email)
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
            const user = await this._workerService.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this._workerService.resendOtp(email);
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
            await this._workerService.verifyOtp(email, otp);
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
            const user = await this._workerService.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found with the given email');
            }
            await this._workerService.resetPass(email, password);
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

