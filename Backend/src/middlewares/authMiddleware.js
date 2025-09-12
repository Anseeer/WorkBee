"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../model/user/user.model"));
const worker_model_1 = __importDefault(require("../model/worker/worker.model"));
const response_1 = require("../utilities/response");
const status_code_1 = require("../constants/status.code");
const Cookie_1 = require("../config/Cookie");
const generateToken_1 = require("../utilities/generateToken");
const messages_1 = require("../constants/messages");
const logger_1 = __importDefault(require("../utilities/logger"));
const role_1 = require("../constants/role");
const auth = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken && !refreshToken) {
        res
            .status(status_code_1.StatusCode.BAD_REQUEST)
            .json(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.AUTH_MESSAGE.ACCESS_DENIED, {}));
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        if (decoded.role === role_1.Role.USER) {
            const user = await user_model_1.default.findById(decoded.id);
            if (!user || user.isActive === false) {
                res.status(403).json({ message: messages_1.AUTH_MESSAGE.USER_BLOCKED });
                return;
            }
        }
        else if (decoded.role === role_1.Role.WORKER) {
            const worker = await worker_model_1.default.findById(decoded.id);
            if (!worker || worker.isActive === false) {
                res.status(403).json({ message: messages_1.AUTH_MESSAGE.USER_BLOCKED });
                return;
            }
        }
        next();
    }
    catch (err) {
        logger_1.default.error(err);
        if (!refreshToken) {
            res.status(401).send(messages_1.AUTH_MESSAGE.NO_REFRESH_TOKEN);
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const newAccessToken = (0, generateToken_1.generate_Access_Token)(decoded.id, decoded.role);
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: Cookie_1.COOKIE_CONFIG.SAME_SITE,
                maxAge: Cookie_1.COOKIE_CONFIG.MAX_AGE,
            });
            req.user = decoded;
            next();
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(400).send(messages_1.AUTH_MESSAGE.NO_REFRESH_TOKEN);
        }
    }
};
exports.auth = auth;
