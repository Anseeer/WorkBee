"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Router = express_1.default.Router();
Router.get("/verify", authMiddleware_1.auth, (req, res) => {
    res.json({
        status: 200,
        message: "Authenticated",
        role: req.user?.role
    });
});
exports.default = Router;
