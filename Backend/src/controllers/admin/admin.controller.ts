import { NextFunction, Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { IAdminController } from "./admin.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IAdminService } from "../../services/admin/admin.services.interface";
import { ADMIN_MESSAGES, WALLET_MESSAGE } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";
import { COOKIE_CONFIG } from "../../config/Cookie";
import { query } from "winston";

@injectable()
export class AdminController implements IAdminController {
    private _adminService: IAdminService;
    constructor(@inject(TYPES.adminService) adminService: IAdminService) {
        this._adminService = adminService;
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error(ADMIN_MESSAGES.MISSING_CREDENTIALS);
            }
            const { accessToken, refreshToken, admin } = await this._adminService.login(req.body);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.LOGIN_SUCCESS, { admin });

            res.cookie("accessToken", accessToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                secure: COOKIE_CONFIG.SECURE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                secure: COOKIE_CONFIG.SECURE,
                maxAge: COOKIE_CONFIG.REFRESH_MAX_AGE,
            });

            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.LOGIN_FAILED, errMsg));
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            res.clearCookie("accessToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            res.json({ message: ADMIN_MESSAGES.LOGOUT_SUCCESS });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.LOGOUT_FAILED, errMsg));
        }
    };

    fetchUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentPage, pageSize } = req.query;
            const { users, totalPage } = await this._adminService.fetchUsers(currentPage as string, pageSize as string);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.FETCH_USERS_SUCCESS, { users, totalPage });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.FETCH_USERS_FAILED, errMsg));
        }
    }

    setIsActiveUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.query.id as string;
            await this._adminService.setIsActiveUsers(id);
            let response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.UPDATE_USERS_STATUS_SUCCESS, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.UPDATE_USERS_STATUS_FAILED, errMsg));
        }
    }

    setIsActiveWorkers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.query.id as string;
            await this._adminService.setIsActiveWorkers(id);
            let response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.UPDATE_WORKERS_STATUS_SUCCESS, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.UPDATE_WORKERS_STATUS_FAILED, errMsg));
        }
    }

    fetchWorkers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { currentPage, pageSize } = req.query;
            const { workers, totalPage } = await this._adminService.fetchWorkers(currentPage as string, pageSize as string);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.FETCH_WORKERS_SUCCESS, { workers, totalPage });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.FETCH_WORKERS_FAILED, errMsg));
        }
    }

    fetchWorkersNonVerified = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const workers = await this._adminService.fetchWorkersNonVerified();
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.FETCH_NON_VERIFIED_WORKERS_SUCCESS, workers);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.FETCH_NON_VERIFIED_WORKERS_FAILED, errMsg));
        }
    }

    fetchAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerId } = req.query;
            const availability = await this._adminService.fetchAvailability(workerId as string);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.FETCH_AVAILABILITY_SUCCESS, availability);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.FETCH_AVAILABILITY_FAILED, errMsg));
        }
    }

    approveWorker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerId } = req.query;
            const approved = await this._adminService.approveWorker(workerId as string);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.APPROVE_WORKER_SUCCESS, approved);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.APPROVE_WORKER_FAILED, errMsg));
        }
    }

    rejectedWorker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerId, reason } = req.query;
            const rejected = await this._adminService.rejectedWorker(workerId as string, reason as string);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.REJECT_WORKER_SUCCESS, rejected)
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.REJECT_WORKER_FAILED, errMsg));
        }
    }

    fetchEarnings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = req.query.filter;
            const userId = null;
            if (!filter) {
                throw new Error("Filter is not get");
            }

            const earnings = await this._adminService.fetchEarnings(userId as null, filter as string);
            const response = new successResponse(StatusCode.OK, WALLET_MESSAGE.WALLET_GET_SUCCESSFULL, { earnings });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WALLET_MESSAGE.WALLET_GET_FAILD, errMsg));
        }
    }

    platformWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const earnings = await this._adminService.platformWallet();
            const response = new successResponse(StatusCode.OK, WALLET_MESSAGE.WALLET_GET_SUCCESSFULL, { earnings });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg)
            next(new errorResponse(StatusCode.BAD_REQUEST, WALLET_MESSAGE.WALLET_GET_FAILD, errMsg));
        }
    }

}