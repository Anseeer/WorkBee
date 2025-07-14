import { Request, Response } from "express";
import { workerUsecase } from "../usecase/worker";
import { errorResponse, successResponse } from "../utilities/response";
import logger from "../utilities/logger";


export class workerController {
    private workerUsecase: workerUsecase;
    constructor(workerUsecase: workerUsecase) {
        this.workerUsecase = workerUsecase
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error("Email and Password are required");
            }
            const credentials = { email, password };
            const { token, worker } = await this.workerUsecase.loginWorker(credentials);
            const response = new successResponse(201, "Login Successfull", { token, worker });
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
            const { token, workerId } = await this.workerUsecase.registerWorker(req.body);
            const response = new successResponse(201, "Worker registration successful", {
                token,
                workerId
            });
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


    createAccount = async (req: Request, res: Response) => {
        const { workerId } = req.query;
        try {
            if (!workerId || typeof workerId !== "string") {
                throw new Error("Worker ID is missing or invalid");
            }
            const { availability, ...workerData } = req.body;
            const result = await this.workerUsecase.createWorker(workerId, availability, workerData);
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
            const user = await this.workerUsecase.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this.workerUsecase.forgotPass(email)
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
            const user = await this.workerUsecase.getUserByEmail(email);
            if (!user) {
                throw new Error(" Cant find the user");
            }
            const otp = await this.workerUsecase.resendOtp(email);
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
            await this.workerUsecase.verifyOtp(email, otp);
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
            const user = await this.workerUsecase.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found with the given email');
            }
            await this.workerUsecase.resetPass(email, password);
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

