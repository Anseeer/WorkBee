import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { NextFunction, Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import { StatusCode } from "../../constants/status.code";
import logger from "../../utilities/logger";
import { IWorkController } from "./work.controller.interface";
import { IWorkService } from "../../services/work/work.service.interface";
import { WORK_MESSAGE, WORKER_MESSAGE } from "../../constants/messages";
import { AuthRequest } from "../../middlewares/authMiddleware";

@injectable()
export class WorkController implements IWorkController {
    private _workService: IWorkService;
    constructor(@inject(TYPES.workService) workService: IWorkService) {
        this._workService = workService;
    }

    createWork = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const workDetails = req.body;
            const userId = req?.user?.id;
            workDetails.userId = userId;
            if (!workDetails) {
                throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }

            const result = await this._workService.createWork(workDetails);
            const response = new successResponse(StatusCode.CREATED, WORK_MESSAGE.WORK_CREATED_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            logger.error(error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_CREATED_FAILD, errMsg));
        }
    }

    fetchWorkHistoryByUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req?.user?.id;
            const { currentPage, pageSize } = req.query;
            if (!userId) {
                throw new Error(WORK_MESSAGE.USER_ID_NOT_GET);
            }

            const result = await this._workService.fetchWorkHistoryByUser(userId, currentPage as string, pageSize as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_HISTORY_FETCH_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_HISTORY_FETCH_FAILD, errMsg));
        }
    }

    fetchWorkHistoryByWorker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerId, currentPage, pageSize } = req.query;
            if (!workerId) {
                throw new Error(WORK_MESSAGE.WORKER_ID_NOT_GET);
            }

            const result = await this._workService.fetchWorkHistoryByWorker(workerId as string, currentPage as string, pageSize as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_HISTORY_FETCH_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_HISTORY_FETCH_FAILD, errMsg));
        }
    }

    cancelWork = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workId, id } = req.query;
            if (!workId) {
                throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            } else if (!id) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID)
            }

            const result = await this._workService.cancel(workId as string, id as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_CANCEL_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_CANCEL_FAILD, errMsg));
        }
    }

    completedWork = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workId, workerId, hoursWorked } = req.query;
            if (!workId) {
                throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            } else if (!workerId) {
                throw new Error(WORK_MESSAGE.WORKER_ID_NOT_GET)
            }

            const result = await this._workService.completed(workId as string, workerId as string, hoursWorked as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_COMPLETED_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_COMPLETED_FAILD, errMsg));
        }
    }

    acceptWork = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workId } = req.query;
            if (!workId) {
                throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            }

            const result = await this._workService.accept(workId as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_ACCEPT_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            logger.error(error);
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_ACCEPT_FAILD, errMsg));
        }
    }

    workDetailsById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workId } = req.query;
            if (!workId) {
                throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            }

            const result = await this._workService.workDetails(workId as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_DETAILS_GET_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_DETAILS_GET_FAILD, errMsg));
        }
    }

    getAllWorks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { currentPage, pageSize } = req.query;
            const { paginatedWorks, totalPage } = await this._workService.getAllWorks(currentPage as string, pageSize as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_DETAILS_GET_SUCCESS, { paginatedWorks, totalPage });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_DETAILS_GET_FAILD, errMsg));
        }
    }

    getAssignedWorks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerId } = req.query;
            const assignedWorks = await this._workService.getAssignedWorks(workerId as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_DETAILS_GET_SUCCESS, { assignedWorks });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_DETAILS_GET_FAILD, errMsg));
        }
    }

    getRequestedWorks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerId } = req.query;
            const requestedWorks = await this._workService.getRequestedWorks(workerId as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_DETAILS_GET_SUCCESS, { requestedWorks });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_DETAILS_GET_FAILD, errMsg));
        }
    }

    getTopThree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const getTopThree = await this._workService.getTopThree();
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_DETAILS_GET_SUCCESS, { getTopThree });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_DETAILS_GET_FAILD, errMsg));
        }
    }

    getTopService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let limit = req.query.limit;
            const getTopService = await this._workService.getTopServices(Number(limit as string));
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_DETAILS_GET_SUCCESS, { getTopService });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_DETAILS_GET_FAILD, errMsg));
        }
    }

}