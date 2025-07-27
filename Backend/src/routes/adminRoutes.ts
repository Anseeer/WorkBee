import express from "express";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { IAdminController } from "../controllers/admin/admin.controller.interface";

const adminController = container.get<IAdminController>(TYPES.adminController)

const Router = express.Router();

Router.post('/register', adminController.register);
Router.post('/login', adminController.login);
Router.post('/forgot-password', adminController.forgotPass);
Router.post('/resend-otp', adminController.resendOtp);
Router.post('/verify-otp', adminController.verifyOtp);
Router.post('/reset-password', adminController.resetPassword);
Router.get('/users', adminController.fetchUsers)
Router.get('/users/set-status', adminController.setIsActiveUsers);
Router.get('/workers/set-status', adminController.setIsActiveWorkers);
Router.get('/workers', adminController.fetchWorkers)


export default Router;