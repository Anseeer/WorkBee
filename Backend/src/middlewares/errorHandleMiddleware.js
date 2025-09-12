"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utilities/logger"));
const status_code_1 = require("../constants/status.code");
const errorHandler = (err, req, res, _next) => {
    const status = err.status || status_code_1.StatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";
    logger_1.default.error(`[${req.method}] ${req.originalUrl} → ${message}`);
    res.status(status).json({
        success: false,
        message,
        statusCode: status,
        data: err.data || null,
    });
};
exports.errorHandler = errorHandler;
