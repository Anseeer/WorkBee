"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const status_code_1 = require("../constants/status.code");
const messages_1 = require("../constants/messages");
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(status_code_1.StatusCode.UNAUTHORIZED).json({ message: messages_1.USERS_MESSAGE.CANT_FIND_USER });
            return;
        }
        if (!allowedRoles.includes(req.user.role || '')) {
            res.status(status_code_1.StatusCode.FORBIDDEN).json({ message: messages_1.AUTH_MESSAGE.ACCESS_DENIED });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
