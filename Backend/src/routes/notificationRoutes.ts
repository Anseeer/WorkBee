import express from "express";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { auth } from "../middlewares/authMiddleware";
import { INotificationController } from "../controllers/notifications/notificatinos.controller.interface";

const notificationController = container.get<INotificationController>(TYPES.notificationController)

const Router = express.Router();

Router.delete('/clear', auth, notificationController.clearNotification);

export default Router;