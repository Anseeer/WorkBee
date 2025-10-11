import express from "express";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { authorize } from "../middlewares/authorizeMiddleware";
import { auth } from "../middlewares/authMiddleware";
import { ISubscriptionController } from "../controllers/subscription/subscription.controller.interface";

const subscriptionController = container.get<ISubscriptionController>(TYPES.subscriptionController)

const Router = express.Router();

Router.post('/create-subscription-plan', auth, authorize(["Admin"]), subscriptionController.createSubscriptionPlan)

export default Router;