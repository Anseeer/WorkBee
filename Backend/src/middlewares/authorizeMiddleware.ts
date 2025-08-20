import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";
import { StatusCode } from "../constants/status.code";
import { AUTH_MESSAGE, USERS_MESSAGE } from "../constants/messages";

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(StatusCode.UNAUTHORIZED).json({ message: USERS_MESSAGE.CANT_FIND_USER });
      return;
    }

    if (!allowedRoles.includes(req.user.role || '')) {
      res.status(StatusCode.FORBIDDEN).json({ message: AUTH_MESSAGE.ACCESS_DENIED });
      return;
    }
    next();
  };
};
