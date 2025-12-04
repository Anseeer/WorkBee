import express from "express";
import container from "../inversify/inversify.container";
import { IWorkerController } from "../controllers/worker/worker.controller.interface";
import TYPES from "../inversify/inversify.types";
import { authorize } from "../middlewares/authorizeMiddleware";
import { auth } from "../middlewares/authMiddleware";
const Router = express.Router();

const workerController = container.get<IWorkerController>(TYPES.workerController);

Router.post("/login", workerController.login);
Router.post("/logout", auth, authorize(["Worker"]), workerController.logout);
Router.post("/register", workerController.register);
Router.post("/verify-register", workerController.verifyRegister);
Router.post("/re-verify-register", workerController.reVerifyRegister);
Router.post("/build-account", auth, authorize(["Worker"]), workerController.buildAccount);
Router.get("/fetch-details", auth, workerController.fetchDetails);
Router.post("/forgot-password", workerController.forgotPass);
Router.post("/resend-otp", workerController.resendOtp);
Router.post("/verify-otp", workerController.verifyOtp);
Router.post("/reset-password", workerController.resetPassword);
Router.post("/change-password",auth, workerController.changePassword);
Router.put("/update", auth, authorize(["Worker"]), workerController.updateWorker);
Router.post("/search", auth, workerController.searchWorker);
Router.post("/find-workers-byId", auth, workerController.findWorkersByIds);
Router.post('/google-login', workerController.googleLogin);
Router.get('/wallet', auth, workerController.findWallet);
Router.get('/earnings', auth, workerController.getEarnings);
Router.get("/ratings", auth, workerController.rateWorkers);
Router.get("/re-approval", auth, workerController.reApprovalRequest);


export default Router;