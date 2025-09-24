import { NextFunction, Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { IWorkerController } from "./worker.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IWorkerService } from "../../services/worker/worker.service.interface";
import { IAvailabilityService } from "../../services/availability/availability.service.interface";
import { SEARCH_TERMS, WALLET_MESSAGE, WORKER_MESSAGE } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";
import { COOKIE_CONFIG } from "../../config/Cookie";
import { IWalletService } from "../../services/wallet/wallet.service.interface";

@injectable()
export class WorkerController implements IWorkerController {
    private _workerService: IWorkerService;
    private _availabilityService: IAvailabilityService;
    private _walletService: IWalletService;
    constructor(
        @inject(TYPES.workerService) workerService: IWorkerService,
        @inject(TYPES.walletService) walletService: IWalletService,
        @inject(TYPES.availabilityService) availabilityService: IAvailabilityService
    ) {
        this._workerService = workerService;
        this._walletService = walletService;
        this._availabilityService = availabilityService;
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error(WORKER_MESSAGE.EMAIL_AND_PASS_REQUIRED);
            }
            const credentials = { email, password };
            const { accessToken, refreshToken, worker, wallet, availability } = await this._workerService.loginWorker(credentials);
            const response = new successResponse(StatusCode.CREATED, WORKER_MESSAGE.LOGIN_SUCCESS, { worker, availability, wallet });
            res.cookie("accessToken", accessToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.REFRESH_MAX_AGE,
            });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.LOGIN_FAILD, errMsg));
        }
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { accessToken, refreshToken, worker, wallet } = await this._workerService.registerWorker(req.body);
            const response = new successResponse(StatusCode.CREATED, WORKER_MESSAGE.REGISTRATION_SUCCESS, { worker, wallet });
            res.cookie("accessToken", accessToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.REFRESH_MAX_AGE,
            });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            console.log("Error ::", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.REGISTRATION_FAILD, errMsg));
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.clearCookie('accessToken', {
                httpOnly: true,
                sameSite: 'strict',
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'strict',
            });
            res.json({ message: WORKER_MESSAGE.LOGOUT_SUCCESs });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.LOGOUT_FAILD, errMsg));
        }
    };


    buildAccount = async (req: Request, res: Response, next: NextFunction) => {
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
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.WORKER_ACCOUNT_BUILD_FAILD, errMsg));;
        }
    };

    forgotPass = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const user = await this._workerService.getUserByEmail(email);
            if (!user) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            const otp = await this._workerService.forgotPass(email)
            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.SUCCESSFULLUY_SEND_OTP, { otp, email });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.FAILD_SEND_OTP, errMsg));
        }
    }

    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
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
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.FAILD_RESEND_OTP, errMsg));
        }
    }

    verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            await this._workerService.verifyOtp(email, otp);
            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.VERIFY_OTP, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.FAILD_VERIFY_OTP, errMsg));
        }

    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
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
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.PASSWORD_RESET_FAILD, errMsg));
        }

    };

    fetchDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const workerId = req.query.workerId;
        try {
            if (!workerId || typeof workerId !== "string") {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const worker = await this._workerService.getUserById(workerId);
            const wallet = await this._walletService.findByUser(worker?.id as string);
            const availability = await this._availabilityService.getAvailabilityByworkerId(workerId)

            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.WORKER_DETAILS_FETCH_SUCCESSFULLY, {
                worker,
                wallet,
                availability
            });

            logger.info(response);
            res.status(response.status).json(response);

        } catch (error: unknown) {
            console.log("Error :", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.WORKER_DETAILS_FETCH_FAILD, errMsg));
        }
    }

    updateWorker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.UPDATE_WORKER_FAILD, errMsg));
        }
    }

    searchWorker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const searchTerms = req.body;
            if (!searchTerms) {
                throw new Error(SEARCH_TERMS.TERM_NOT_EXIST);
            }

            const workers = await this._workerService.searchWorker(searchTerms);
            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.GET_WORKERS_SUCCESSFULL, { workers });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.GET_WORKERS_FAILD, errMsg));
        }
    }

    findWorkersByIds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerIds } = req.body;
            if (!workerIds) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const workers = await this._workerService.findWorkersByIds(workerIds);
            const response = new successResponse(StatusCode.OK, WORKER_MESSAGE.GET_WORKERS_SUCCESSFULL, { workers });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.GET_WORKERS_FAILD, errMsg));
        }
    }

    googleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { credential } = req.body;
            const { accessToken, refreshToken, worker, wallet, availability } = await this._workerService.googleLogin(credential);

            const response = new successResponse(StatusCode.CREATED, WORKER_MESSAGE.GOOGLE_LOGIN_SUCCESS, { worker, wallet, availability });
            logger.info(response)
            res.cookie("accessToken", accessToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.REFRESH_MAX_AGE,
            });
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORKER_MESSAGE.GOOGLE_LOGIN_FAILED, errMsg));
        }
    }

    findWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const workerId = req.query.workerId;
            if (!workerId || typeof workerId !== 'string') {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const wallet = await this._workerService.findWallet(workerId as string);
            const response = new successResponse(StatusCode.OK, WALLET_MESSAGE.WALLET_GET_SUCCESSFULL, { wallet });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WALLET_MESSAGE.WALLET_GET_FAILD, errMsg));
        }
    }

    getEarnings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const workerId = req.query.workerId;
            const filter = req.query.filter;

            if (!workerId || !filter) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const earnings = await this._walletService.getEarnings(workerId as string, filter as string);
            const response = new successResponse(StatusCode.OK, WALLET_MESSAGE.WALLET_GET_SUCCESSFULL, { earnings });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WALLET_MESSAGE.EARNINGS_GET_FAILD, errMsg));

        }
    }
}

