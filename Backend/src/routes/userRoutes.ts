import express from "express";
import container from "../inversify/inversify.container";
import { IUserController } from "../controllers/user/user.controller.interface";
import TYPES from "../inversify/inversify.types";
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

const userController = container.get<IUserController>(TYPES.userController);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.post('/forgot-password', userController.forgotPass);
router.post('/resend-otp', userController.resendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/reset-password', userController.resetPassword);

export default router;