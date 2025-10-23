import { NextFunction, Request, Response } from "express";

export interface IWorkerController {
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotPass(req: Request, res: Response, next: NextFunction): Promise<void>;
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    buildAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
    searchWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
    findWorkersByIds(req: Request, res: Response, next: NextFunction): Promise<void>;
    findWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
    getEarnings(req: Request, res: Response, next: NextFunction): Promise<void>;
    rateWorkers(req: Request, res: Response, next: NextFunction): Promise<void>;
    reApprovalRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
}