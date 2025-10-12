import { NextFunction, Request, Response } from "express";

export interface ISubscriptionController {
    createSubscriptionPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
}