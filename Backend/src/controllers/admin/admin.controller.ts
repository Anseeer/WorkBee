import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { IAdminController } from "./admin.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IAdminService } from "../../services/admin/admin.services.interface";
import { ADMIN_MESSAGES } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";
import { COOKIE_CONFIG } from "../../config/Cookie";

@injectable()
export class AdminController implements IAdminController {
    private _adminService: IAdminService;
    constructor(@inject(TYPES.adminService) adminService: IAdminService) {
        this._adminService = adminService;
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error(ADMIN_MESSAGES.MISSING_CREDENTIALS);
            }
            const { token, admin } = await this._adminService.login(req.body);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.LOGIN_SUCCESS, { admin });
            res.cookie("token", token, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                secure: COOKIE_CONFIG.SECURE,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.LOGIN_FAILED, errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.json({ message: ADMIN_MESSAGES.LOGOUT_SUCCESS });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.LOGOUT_FAILED, errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


    fetchUsers = async (req: Request, res: Response) => {
        try {
            const users = await this._adminService.fetchUsers();
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.FETCH_USERS_SUCCESS, users);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.FETCH_USERS_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    setIsActiveUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.query.id as string;
            await this._adminService.setIsActiveUsers(id);
            let response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.UPDATE_USERS_STATUS_SUCCESS, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.UPDATE_USERS_STATUS_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    setIsActiveWorkers = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.query.id as string;
            await this._adminService.setIsActiveWorkers(id);
            let response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.UPDATE_WORKERS_STATUS_SUCCESS, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.UPDATE_WORKERS_STATUS_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    fetchWorkers = async (req: Request, res: Response): Promise<void> => {
        try {
            const workers = await this._adminService.fetchWorkers();
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.FETCH_WORKERS_SUCCESS, workers);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.FETCH_WORKERS_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    fetchWorkersNonVerified = async (req: Request, res: Response): Promise<void> => {
        try {
            const workers = await this._adminService.fetchWorkersNonVerified();
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.FETCH_NON_VERIFIED_WORKERS_SUCCESS, workers);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.FETCH_NON_VERIFIED_WORKERS_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    fetchAvailability = async (req: Request, res: Response): Promise<void> => {
        try {
            const { workerId } = req.query;
            const availability = await this._adminService.fetchAvailability(workerId as string);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.FETCH_AVAILABILITY_SUCCESS, availability);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.FETCH_AVAILABILITY_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    approveWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const { workerId } = req.query;
            const approved = await this._adminService.approveWorker(workerId as string);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.APPROVE_WORKER_SUCCESS, approved);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.APPROVE_WORKER_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    rejectedWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const { workerId } = req.query;
            const rejected = await this._adminService.rejectedWorker(workerId as string);
            const response = new successResponse(StatusCode.OK, ADMIN_MESSAGES.REJECT_WORKER_SUCCESS, rejected)
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, ADMIN_MESSAGES.REJECT_WORKER_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

}