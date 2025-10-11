import { NextFunction, Request, Response } from "express";

export interface ISubscriptionController {
    createSubscriptionPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
}