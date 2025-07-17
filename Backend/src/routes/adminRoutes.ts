import express from "express";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { IUserController } from "../controllers/user/user.controller.interface";

const adminController = container.get<IUserController>(TYPES.adminController)

const Router = express.Router();

Router.post('/register', adminController.register);
Router.post('/login', adminController.login);
Router.post('/forgot-password', adminController.forgotPass);
Router.post('/resend-otp', adminController.resendOtp);
Router.post('/verify-otp', adminController.verifyOtp);
Router.post('/reset-password', adminController.resetPassword);


export default Router;