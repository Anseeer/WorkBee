"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_Refresh_Token = exports.generate_Access_Token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generate_Access_Token = (id, role) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    return jsonwebtoken_1.default.sign({ id, role }, secret, { expiresIn });
};
exports.generate_Access_Token = generate_Access_Token;
const generate_Refresh_Token = (id, role) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '1d';
    return jsonwebtoken_1.default.sign({ id, role }, secret, { expiresIn });
};
exports.generate_Refresh_Token = generate_Refresh_Token;
