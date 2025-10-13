import { inject, injectable } from "inversify";
import { ISubscriptionService } from "../../services/subscription/subscription.service.interface";
import TYPES from "../../inversify/inversify.types";
import { ISubscriptionController } from "./subscription.controller.interface";
import { NextFunction, Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import { StatusCode } from "../../constants/status.code";
import { COMMON_MESSAGE, SUBSCRIPTION_MESSAGE } from "../../constants/messages";
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
            console.log("Subscription :", subscription);
            if (!subscription.planName || !subscription.description || !subscription.durationInDays || subscription.amount < 0 || !subscription.comission) {
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

    fetchAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { currentPage, limit, status } = req.query;
            if (!currentPage || !limit) {
                throw new Error(COMMON_MESSAGE.PAGINATION_DATA_NOT_FOUND)
            }
            const { subscription, totalPage } = await this._subscriptionService.find(currentPage?.toString(), limit?.toString(), status ? status === 'true' : undefined);
            const response = new successResponse(StatusCode.CREATED, SUBSCRIPTION_MESSAGE.FETCH_SUCCESS, { subscription, totalPage });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SUBSCRIPTION_MESSAGE.FETCH_FAILD, errMsg));
        }
    }

    deleteSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { subscriptionId } = req.query;
            if (!subscriptionId) {
                throw new Error(SUBSCRIPTION_MESSAGE.ID_NOT_FOUND)
            }
            await this._subscriptionService.delete(subscriptionId as string);
            const response = new successResponse(StatusCode.CREATED, SUBSCRIPTION_MESSAGE.FETCH_SUCCESS, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SUBSCRIPTION_MESSAGE.FETCH_FAILD, errMsg));
        }
    }

    toggleStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { subscriptionId } = req.query;
            if (!subscriptionId) {
                throw new Error(SUBSCRIPTION_MESSAGE.ID_NOT_FOUND)
            }
            await this._subscriptionService.toggleStatus(subscriptionId as string);
            const response = new successResponse(StatusCode.CREATED, SUBSCRIPTION_MESSAGE.STATUS_UPDATE_SUCCESSFULLY, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SUBSCRIPTION_MESSAGE.STATUS_UPDATE_FAILD, errMsg));
        }
    }

    updateSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { subscriptionId } = req.query;
            const subscriptionData = req.body;
            if (!subscriptionId) {
                throw new Error(SUBSCRIPTION_MESSAGE.ID_NOT_FOUND)
            }
            if (!subscriptionData) {
                throw new Error(SUBSCRIPTION_MESSAGE.MISSING_DATA)
            }
            await this._subscriptionService.update(subscriptionId as string, subscriptionData);
            const response = new successResponse(StatusCode.CREATED, SUBSCRIPTION_MESSAGE.UPDATE_SUCCESSFULLY, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SUBSCRIPTION_MESSAGE.UPDATE_FAILD, errMsg));
        }
    }

    activateSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerId, planId } = req.query;

            if (!workerId || !planId) {
                throw new Error(SUBSCRIPTION_MESSAGE.MISSING_DATA)
            }
            await this._subscriptionService.activateSubscriptionPlan(workerId as string, planId as string, null);
            const response = new successResponse(StatusCode.CREATED, SUBSCRIPTION_MESSAGE.ACTIVE_PLAN_SUCCESSFULLY, {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SUBSCRIPTION_MESSAGE.ACTIVE_PLAN_FAILD, errMsg));
        }
    }

}