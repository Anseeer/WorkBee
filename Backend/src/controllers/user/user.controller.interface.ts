import { NextFunction, Request, Response } from "express";

export interface IUserController {
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotPass(req: Request, res: Response, next: NextFunction): Promise<void>;
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchData(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    findUsersByIds(req: Request, res: Response, next: NextFunction): Promise<void>;
}
