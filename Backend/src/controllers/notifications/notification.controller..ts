import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { NextFunction, Request, Response } from "express";
import { NOTIFICATION_MESSAGE } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";
import { INotificationController } from "./notificatinos.controller.interface";
import { INotificationService } from "../../services/notification/notification.service.interface";

@injectable()
export class NotificationController implements INotificationController {
    private _notificationService: INotificationService;

    constructor(@inject(TYPES.notificationService) notificationService: INotificationService) {
        this._notificationService = notificationService;
    }

    clearNotification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.query.userId;
            await this._notificationService.clearNotification(userId as string);
            const response = new successResponse(StatusCode.CREATED, NOTIFICATION_MESSAGE.CLEAT_NOTIFICATION_SUCCESSFULL, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            logger.error("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, NOTIFICATION_MESSAGE.CLEAT_NOTIFICATION_FAILD, errMsg));
        }
    }

}