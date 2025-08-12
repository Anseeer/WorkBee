import { Request, Response } from "express";

export interface ICategoryController {
    getAll(req: Request, res: Response): Promise<void>;
    createCategory(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    setIsActive(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getByWorker(req: Request, res: Response): Promise<void>;
}