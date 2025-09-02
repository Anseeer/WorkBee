import { NextFunction, Request, Response } from "express";

export interface IWorkController {
    createWork(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchWorkHistoryByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchWorkHistoryByWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelWork(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptWork(req: Request, res: Response, next: NextFunction): Promise<void>;
    completedWork(req: Request, res: Response, next: NextFunction): Promise<void>;
    workDetailsById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllWorks(req: Request, res: Response, next: NextFunction): Promise<void>;
}