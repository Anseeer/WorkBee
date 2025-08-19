import { Request, Response } from "express";

export interface IWorkController {
    createWork(req: Request, res: Response): Promise<void>;
    fetchWorkHistoryByUser(req: Request, res: Response): Promise<void>;
    fetchWorkHistoryByWorker(req: Request, res: Response): Promise<void>;
    cancelWork(req: Request, res: Response): Promise<void>;
    acceptWork(req: Request, res: Response): Promise<void>;
    completedWork(req: Request, res: Response): Promise<void>;
    workDetailsById(req: Request, res: Response): Promise<void>;
    getAllWorks(req: Request, res: Response): Promise<void>;
}