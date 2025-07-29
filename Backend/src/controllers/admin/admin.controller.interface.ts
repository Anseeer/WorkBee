import { Request, Response } from "express";

export interface IAdminController {
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    fetchUsers(req: Request, res: Response): Promise<void>;
    setIsActiveUsers(req: Request, res: Response): Promise<void>;
    setIsActiveWorkers(req: Request, res: Response): Promise<void>;
    fetchWorkers(req: Request, res: Response): Promise<void>;
}