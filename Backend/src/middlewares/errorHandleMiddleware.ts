import { NextFunction, Request, Response } from "express";
import logger from "../utilities/logger";

interface CustomError extends Error {
    statusCode?: number | undefined;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    _next: NextFunction
) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`[${req.method}] ${req.originalUrl} → ${message}`);

    res.status(status).json({
        success: false,
        message,
        statusCode: status,
    });
};
