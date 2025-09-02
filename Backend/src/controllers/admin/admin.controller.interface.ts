import { NextFunction, Request, Response } from "express";

export interface IAdminController {
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    setIsActiveUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    setIsActiveWorkers(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchWorkers(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchWorkersNonVerified(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    approveWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
    rejectedWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
}