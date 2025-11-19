import { NextFunction, Request, Response } from "express";

export interface INotificationController {
    clearNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
}