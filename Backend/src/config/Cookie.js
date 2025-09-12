"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
exports.COOKIE_CONFIG = {
    MAX_AGE: Number(process.env.TOKEN_MAX_AGE) * 1000,
    REFRESH_MAX_AGE: Number(process.env.REFRESH_TOKEN_MAX_AGE) * 1000,
    SAME_SITE: "strict",
    HTTP_ONLY: true,
    SECURE: process.env.NODE_ENV === "production",
};
