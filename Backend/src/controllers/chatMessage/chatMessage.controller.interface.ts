import { NextFunction, Request, Response } from "express";

export interface IChatController {
    findUsersInChat(req: Request, res: Response, next: NextFunction): Promise<void>;
}