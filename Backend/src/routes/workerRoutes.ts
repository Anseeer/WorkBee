import express from "express";
import container from "../inversify/inversify.container";
import { IWorkerController } from "../controllers/worker/worker.controller.interface";
import TYPES from "../inversify/inversify.types";
import { auth } from "../middlewares/authMiddleware";

const Router = express.Router();

const workerController = container.get<IWorkerController>(TYPES.workerController);

Router.post("/login", workerController.login);
Router.post("/logout", auth, workerController.logout);
Router.post("/register", workerController.register);
Router.patch("/create-account", auth, workerController.createAccount);
Router.post("/forgot-password", workerController.forgotPass);
Router.post("/resend-otp", workerController.resendOtp);
Router.post("/verify-otp", workerController.verifyOtp);
Router.post("/reset-password", workerController.resetPassword);


export default Router; workerController