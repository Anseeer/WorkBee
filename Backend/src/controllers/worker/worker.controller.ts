import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { IWorkerController } from "./worker.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IWorkerService } from "../../services/worker/worker.service.interface";
import { IAvailabilityService } from "../../services/availability/availability.service.interface";
import { WORKER_MESSAGE } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";
import { COOKIE_CONFIG } from "../../config/Cookie";
import { IWorkRepository } from "../../repositories/work/work.repo.interface";
import { IWalletRepository } from "../../repositories/wallet/wallet.repo.interface";

@injectable()
export class WorkerController implements IWorkerController {
    private _workerService: IWorkerService;
    private _availabilityService: IAvailabilityService;
    private _walletRepository: IWalletRepository;
    constructor(
        @inject(TYPES.workerService) workerService: IWorkerService,
        @inject(TYPES.walletRepository) walletRepo: IWalletRepository,
        @inject(TYPES.availabilityService) availabilityService: IAvailabilityService
    ) {
        this._workerService = workerService,
        this._walletRepository = walletRepo,
        this._availabilityService = availabilityService
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error(WORKER_MESSAGE.EMAIL_AND_PASS_REQUIRED);
            }
            const credentials = { email, password };
            const { token, worker, wallet, availability } = await this._workerService.loginWorker(credentials);
            const response = new successResponse(StatusCode.CREATED, WORKER_MESSAGE.LOGIN_SUCCESS, { worker, availability, wallet });
            res.cookie("token", token, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                secure: COOKIE_CONFIG.SECURE,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.LOGIN_FAILD, errMsg);
            logger.error(response)
            res.status(response.status).json(response);
        }
    }



    register = async (req: Request, res: Response) => {
        try {
            const { token, worker, wallet } = await this._workerService.registerWorker(req.body);
            const response = new successResponse(StatusCode.CREATED, WORKER_MESSAGE.REGISTRATION_SUCCESS, { worker, wallet });
            res.cookie("token", token, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                secure: COOKIE_CONFIG.SECURE,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.REGISTRATION_FAILD, errMsg);
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
            res.json({ message: WORKER_MESSAGE.LOGOUT_SUCCESs });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.LOGOUT_FAILD, errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


    buildAccount = async (req: Request, res: Response) => {
        const { workerId } = req.query;

        try {
            if (!workerId || typeof workerId !== "string") {
                throw new Error(WORKER_MESSAGE.Availability_or_WorkerID_In_Availability_Not_Get);
            }

            const { availability, ...workerData } = req.body;

            const result = await this._workerService.buildAccount(workerId, availability, workerData);

            const response = new successResponse(StatusCode.CREATED, WORKER_MESSAGE.WORKER_ACCOUNT_BUILD_SUCCESSFULLY, {
                worker: result.updatedWorker,
                availability: result.updatedAvailability
            });

            logger.info(response);
            res.status(response.status).json(response);

        } catch (error: unknown) {
            const err = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.WORKER_ACCOUNT_BUILD_FAILD, err);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


    forgotPass = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this._workerService.getUserByEmail(email);
            if (!user) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            const otp = await this._workerService.forgotPass(email)
            logger.info("OTP :", otp);
            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.SUCCESSFULLUY_SEND_OTP, { otp, email });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.FAILD_SEND_OTP, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    resendOtp = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this._workerService.getUserByEmail(email);
            if (!user) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            const otp = await this._workerService.resendOtp(email);
            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.SUCCESSFULLUY_RESEND_OTP, { otp });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.FAILD_RESEND_OTP, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    verifyOtp = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            await this._workerService.verifyOtp(email, otp);
            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.VERIFY_OTP, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.FAILD_VERIFY_OTP, message);
            logger.error(response)
            res.status(response.status).json(response);
        }

    }

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error(WORKER_MESSAGE.EMAIL_AND_PASS_REQUIRED);
            }
            const user = await this._workerService.getUserByEmail(email);
            if (!user) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            await this._workerService.resetPass(email, password);
            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.PASSWORD_RESET_SUCCESSFULLY, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.PASSWORD_RESET_FAILD, message);
            logger.error(response)
            res.status(response.status).json(response);
        }

    };

    fetchDetails = async (req: Request, res: Response): Promise<void> => {
        const workerId = req.query.workerId;
        console.log("Query :", req.query)
        console.log("WorkerID Of Fetch Details::", workerId);
        try {
            if (!workerId || typeof workerId !== "string") {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const worker = await this._workerService.getUserById(workerId);
            const wallet = await this._walletRepository.findByUser(worker?.id);
            const availability = await this._availabilityService.getAvailabilityByworkerId(workerId)

            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.WORKER_DETAILS_FETCH_SUCCESSFULLY, {
                worker,
                wallet,
                availability
            });

            logger.info(response);
            res.status(response.status).json(response);

        } catch (error: unknown) {
            console.log(error);
            const err = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.WORKER_DETAILS_FETCH_FAILD, err);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    updateWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const { workerData } = req.body;
            const worker = workerData.worker;
            const availability = workerData.availability;
            if (!worker || !worker._id) {
                throw new Error(WORKER_MESSAGE.WORKER_DATA_OR_ID_NOT_GET);
            }

            if (!availability || !availability.workerId) {
                throw new Error(WORKER_MESSAGE.Availability_or_WorkerID_In_Availability_Not_Get)
            }
            await this._availabilityService.updateAvailability(availability);
            await this._workerService.updateWorker(worker);
            const response = new successResponse(StatusCode.CREATED, WORKER_MESSAGE.UPDATE_WORKER_SUCCESSFULLY, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.UPDATE_WORKER_FAILD, err);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    searchWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const searchTerms = req.body;
            if (!searchTerms) {
                throw new Error("Search term not exitst");
            }

            const workers = await this._workerService.searchWorker(searchTerms);
            const response = new successResponse(StatusCode.OK, "Success fully get the workers", { workers });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, "faild to search workers ", err);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

}

