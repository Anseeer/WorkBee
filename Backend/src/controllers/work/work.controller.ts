import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import { StatusCode } from "../../constants/status.code";
import logger from "../../utilities/logger";
import { IWorkController } from "./work.controller.interface";
import { IWorkService } from "../../services/work/work.service.interface";
import { WORK_MESSAGE } from "../../constants/messages";

@injectable()
export class WorkController implements IWorkController {
    private _workService: IWorkService;
    constructor(@inject(TYPES.workService) workService: IWorkService) {
        this._workService = workService;
    }

    createWork = async (req: Request, res: Response): Promise<void> => {
        try {
            const workDetails = req.body;
            if (!workDetails) {
                throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }

            const result = await this._workService.createWork(workDetails);
            const response = new successResponse(StatusCode.CREATED, WORK_MESSAGE.WORK_CREATED_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, WORK_MESSAGE.WORK_CREATED_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

}