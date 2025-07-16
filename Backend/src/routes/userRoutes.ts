import express from "express";
import { UserRepository } from "../repositories/user/user.repo";
import { UserService } from "../services/user/user.service";
import { UserController } from "../controllers/user/user.controller";

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPass);
router.post('/resend-otp', userController.resendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/reset-password', userController.resetPassword);

export default router;