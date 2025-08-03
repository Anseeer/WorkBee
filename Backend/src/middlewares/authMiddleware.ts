import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: JwtPayload & { role?: string };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { role: string };
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
