import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import { StatusCode } from "../../constants/status.code";
import logger from "../../utilities/logger";
import { IWorkController } from "./work.controller.interface";
import { IWorkService } from "../../services/work/work.service.interface";
import { WORK_MESSAGE } from "../../constants/messages";
import { AuthRequest } from "../../middlewares/authMiddleware";

@injectable()
export class WorkController implements IWorkController {
    private _workService: IWorkService;
    constructor(@inject(TYPES.workService) workService: IWorkService) {
        this._workService = workService;
    }

    createWork = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const workDetails = req.body;
            const userId = req?.user?.id;
            workDetails.userId = userId;
            console.log("WorkDetails ::", workDetails)
            if (!workDetails) {
                throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }

            const result = await this._workService.createWork(workDetails);
            const response = new successResponse(StatusCode.CREATED, WORK_MESSAGE.WORK_CREATED_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_CREATED_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    fetchWorkHistoryByUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req?.user?.id;
            if (!userId) {
                throw new Error(WORK_MESSAGE.USER_ID_NOT_GET);
            }

            const result = await this._workService.fetchWorkHistoryByUser(userId);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_HISTORY_FETCH_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_HISTORY_FETCH_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    fetchWorkHistoryByWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const { workerId } = req.query;
            console.log("queryyyyy :::", req.query)
            console.log("workerId :::", workerId)
            if (!workerId) {
                throw new Error(WORK_MESSAGE.WORKER_ID_NOT_GET);
            }

            const result = await this._workService.fetchWorkHistoryByWorker(workerId as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_HISTORY_FETCH_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_HISTORY_FETCH_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    cancelWork = async (req: Request, res: Response): Promise<void> => {
        try {
            const { workId } = req.query;
            if (!workId) {
                throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            }

            const result = await this._workService.cancel(workId as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_CANCEL_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_CANCEL_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    completedWork = async (req: Request, res: Response): Promise<void> => {
        try {
            const { workId } = req.query;
            if (!workId) {
                throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            }

            const result = await this._workService.completed(workId as string);
            const response = new successResponse(StatusCode.OK, WORK_MESSAGE.WORK_COMPLETED_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error in the completded work",error);
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_COMPLETED_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    acceptWork = async (req: Request, res: Response): Promise<void> => {
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
            console.log(error);
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_ACCEPT_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    workDetailsById = async (req: Request, res: Response): Promise<void> => {
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
            console.log(error);
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_DETAILS_GET_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

}