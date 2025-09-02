import { NextFunction, Request, Response } from "express";

export interface ICategoryController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    setIsActive(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    getByWorker(req: Request, res: Response, next: NextFunction): Promise<void>;
}