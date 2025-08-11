import { Request, Response } from "express";

export interface IServiceController {
    createService(req: Request, res: Response): Promise<void>;
    getAllservices(req: Request, res: Response): Promise<void>;
    getByCategories(req: Request, res: Response): Promise<void>;
    getByWorker(req: Request, res: Response): Promise<void>;
    getBySearch(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    setIsActive(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}