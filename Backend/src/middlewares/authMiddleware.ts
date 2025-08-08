import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import User from '../model/user/user.model';
import Worker from '../model/worker/worker.model';

export interface AuthRequest extends Request {
  user?: JwtPayload & { role?: string };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { role: string };
    req.user = decoded;

    if (decoded.role === 'User') {
      const user = await User.findById(decoded.id);
      if (!user || user.isActive === false) {
        res.status(403).json({ message: 'Access denied: User account is blocked' });
        return;
      }
    } else if (decoded.role === 'Worker') {
      const worker = await Worker.findById(decoded.id);
      if (!worker || worker.isActive === false) {
        res.status(403).json({ message: 'Access denied: Worker account is blocked' });
        return;
      }
    }

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
