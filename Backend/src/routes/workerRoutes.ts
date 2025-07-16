import express from "express";
import { WorkerRepository } from "../repositories/worker/worker.repo";
import { WorkerService } from "../services/worker/worker.service";
import { WorkerController } from "../controllers/worker/worker.controller";

const Router = express.Router();

const workerRepository = new WorkerRepository();
const workerService = new WorkerService(workerRepository);
const workerController = new WorkerController(workerService);

Router.post("/login", workerController.login);
Router.post("/register", workerController.register);
Router.patch("/create-account", workerController.createAccount);
Router.post("/forgot-password", workerController.forgotPass);
Router.post("/resend-otp", workerController.resendOtp);
Router.post("/verify-otp", workerController.verifyOtp);
Router.post("/reset-password", workerController.resetPassword);


export default Router; workerController