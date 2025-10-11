import { inject, injectable } from "inversify";
import { ISubscriptionService } from "../../services/subscription/subscription.service.interface";
import TYPES from "../../inversify/inversify.types";
import { ISubscriptionController } from "./subscription.controller.interface";
import { NextFunction, Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import { StatusCode } from "../../constants/status.code";
import { SUBSCRIPTION_MESSAGE } from "../../constants/messages";
import logger from "../../utilities/logger";

@injectable()
export class SubscriptionController implements ISubscriptionController {
    private _subscriptionService: ISubscriptionService;
    constructor(@inject(TYPES.subscriptionService) subscriptionService: ISubscriptionService) {
        this._subscriptionService = subscriptionService;
    }

    createSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const subscription = req.body;
            console.log("Subscription :",subscription);
            if (!subscription.planName || !subscription.description || !subscription.durationInDays || subscription.amount < 0 || !subscription.comission ) {
                throw new Error(SUBSCRIPTION_MESSAGE.MISSING_DATA)
            }
            const result = await this._subscriptionService.create(subscription);
            const response = new successResponse(StatusCode.CREATED, SUBSCRIPTION_MESSAGE.SUCCESSFULLY_CREATED, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SUBSCRIPTION_MESSAGE.FAILD_CREATED, errMsg));
        }
    }

}