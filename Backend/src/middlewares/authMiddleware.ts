import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import User from '../model/user/user.model';
import Worker from '../model/worker/worker.model';
import { errorResponse } from '../utilities/response';
import { StatusCode } from '../constants/status.code';
import { COOKIE_CONFIG } from '../config/Cookie';
import { generate_Access_Token } from '../utilities/generateToken';
import { AUTH_MESSAGE } from '../constants/messages';
import logger from '../utilities/logger';
import { Role } from '../constants/role';

export interface AuthRequest extends Request {
  user?: JwtPayload & { id: string; role: string };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    res
      .status(StatusCode.OK)
      .json(new errorResponse(StatusCode.OK, AUTH_MESSAGE.ACCESS_DENIED, {}));
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload & { role: string; id: string };
    req.user = decoded;

    if (decoded.role === Role.USER) {
      const user = await User.findById(decoded.id);
      if (!user || user.isActive === false) {
        res.status(403).json({ message: AUTH_MESSAGE.USER_BLOCKED });
        return;
      }
    } else if (decoded.role === Role.WORKER) {
      const worker = await Worker.findById(decoded.id);
      if (!worker || worker.isActive === false) {
        res.status(403).json({ message: AUTH_MESSAGE.USER_BLOCKED });
        return;
      }
    }

    next();
  } catch (err) {
    logger.error(err)

    if (!refreshToken) {
      res.status(401).send(AUTH_MESSAGE.NO_REFRESH_TOKEN);
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload & { id: string; role: string };

      const newAccessToken = generate_Access_Token(decoded.id, decoded.role);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: COOKIE_CONFIG.MAX_AGE,
      });

      req.user = decoded;
      next();
    } catch (error) {
      logger.error(error);
      res.status(400).send(AUTH_MESSAGE.NO_REFRESH_TOKEN);
    }
  }
};

