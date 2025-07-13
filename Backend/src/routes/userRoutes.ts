import express from "express";
import { UserRepository } from "../repository/userRepository";
import { UserController } from "../controllers/userController";
import { userUsecase } from "../usecase/user";

const router = express.Router();

const userRepository = new UserRepository();
const userService = new userUsecase(userRepository);
const userController = new UserController(userService)

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPass);
router.post('/resend-otp', userController.resendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/reset-password', userController.resetPassword);

export default router;