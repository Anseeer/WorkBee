import express from "express";
import { workerRepository } from "../repository/workerRepository";
import { workerUsecase } from "../usecase/worker";
import { workerController } from "../controllers/workerController";

const Router = express.Router();

const WorkerRepository = new workerRepository();
const WorkerUsecase = new workerUsecase(WorkerRepository);
const WorkerController = new workerController(WorkerUsecase);

Router.post("/login", WorkerController.login);
Router.post("/register", WorkerController.register);
Router.patch("/create-account", WorkerController.createAccount);
Router.post("/forgot-password", WorkerController.forgotPass);
Router.post("/resend-otp", WorkerController.resendOtp);
Router.post("/verify-otp", WorkerController.verifyOtp);
Router.post("/reset-password", WorkerController.resetPassword);


export default Router;