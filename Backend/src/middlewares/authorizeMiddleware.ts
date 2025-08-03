import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: No user found' });
      return;
    }

    if (!allowedRoles.includes(req.user.role || '')) {
      res.status(403).json({ message: 'Forbidden: Access denied' });
      return;
    }

    next();
  };
};
