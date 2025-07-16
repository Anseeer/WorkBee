import express from "express";
import { AdminRepository } from "../repositories/admin/admin.repo";
import { AdminService } from "../services/admin/admin.service";
import { AdminController } from "../controllers/admin/admin.controller";

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const Router = express.Router();

Router.post('/register', adminController.register);
Router.post('/login', adminController.login);
Router.post('/forgot-password', adminController.forgotPass);
Router.post('/resend-otp', adminController.resendOtp);
Router.post('/verify-otp', adminController.verifyOtp);
Router.post('/reset-password', adminController.resetPassword);


export default Router;