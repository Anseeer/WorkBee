import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";
import { StatusCode } from "../constants/status.code";

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(StatusCode.UNAUTHORIZED).json({ message: 'Unauthorized: No user found' });
      return;
    }

    if (!allowedRoles.includes(req.user.role || '')) {
      res.status(StatusCode.FORBIDDEN).json({ message: 'Forbidden: Access denied' });
      return;
    }

    next();
  };
};
