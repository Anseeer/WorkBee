import express from "express";
import { adminRepository } from "../repository/adminRepository";
import { adminUsecase } from "../usecase/admin";
import { adminController } from "../controllers/adminController";

const AdminRepository = new adminRepository();
const AdminUsecase = new adminUsecase(AdminRepository);
const AdminController = new adminController(AdminUsecase);

const Router = express.Router();

Router.post('/register',AdminController.register);
Router.post('/login',AdminController.login);
Router.post('/forgot-password', AdminController.forgotPass);
Router.post('/resend-otp', AdminController.resendOtp);
Router.post('/verify-otp', AdminController.verifyOtp);
Router.post('/reset-password', AdminController.resetPassword);


export default Router;