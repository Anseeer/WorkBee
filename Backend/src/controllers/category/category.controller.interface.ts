import { Request, Response } from "express";

export interface ICategoryController {
    getAllCategories(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    createCategory(req: Request, res: Response): Promise<void>;
    setIsActive(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}