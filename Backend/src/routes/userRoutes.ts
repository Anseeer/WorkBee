import express from "express";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/userController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService)

router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/forgot-password',userController.forgotPass);
router.post('/resend-otp',userController.resendOtp);
router.post('/verify-otp',userController.verifyOtp);
router.post('/reset-password',userController.resetPassword);

export default router;