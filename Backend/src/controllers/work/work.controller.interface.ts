import { Request, Response } from "express";

export interface IWorkController {
    createWork(req: Request, res: Response): Promise<void>;
}