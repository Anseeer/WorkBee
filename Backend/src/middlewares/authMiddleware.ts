import jwt , {JwtPayload} from 'jsonwebtoken'
import { Response , Request ,NextFunction } from 'express'

interface authRequest extends Request{
  user?: JwtPayload | string;
}

export const protectRoute = (req:authRequest,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}