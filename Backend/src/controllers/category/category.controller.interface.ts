import { Request, Response } from "express";

export interface ICategoryController {
    getAllCategories(req: Request, res: Response): Promise<void>;
}