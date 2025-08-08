import { NextFunction, Request, Response } from "express";
import logger from "../utilities/logger";
import { StatusCode } from "../constants/status.code";

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
    const status = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';

    logger.error(`[${req.method}] ${req.originalUrl} → ${message}`);

    res.status(status).json({
        success: false,
        message,
        statusCode: status,
    });
};
