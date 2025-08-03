import jwt, { Secret } from "jsonwebtoken";

const generateToken = (id: string, role: string): string => {
    const secret: Secret = process.env.JWT_SECRET as string;
    const expiresIn = (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d';

    return jwt.sign({ id, role }, secret, { expiresIn });
};

export default generateToken;
