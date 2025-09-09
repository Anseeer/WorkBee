import express from "express";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { auth } from "../middlewares/authMiddleware";
import { IChatController } from "../controllers/chatMessage/chatMessage.controller.interface";

const chatController = container.get<IChatController>(TYPES.chatController);

const Router = express.Router();

Router.get('/fetch-chat', auth, chatController.findUsersInChat);

export default Router;