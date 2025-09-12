"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_container_1 = __importDefault(require("../inversify/inversify.container"));
const inversify_types_1 = __importDefault(require("../inversify/inversify.types"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const chatController = inversify_container_1.default.get(inversify_types_1.default.chatController);
const Router = express_1.default.Router();
Router.get('/fetch-chat', authMiddleware_1.auth, chatController.findUsersInChat);
exports.default = Router;
