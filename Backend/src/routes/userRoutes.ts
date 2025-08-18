import express from "express";
import container from "../inversify/inversify.container";
import { IUserController } from "../controllers/user/user.controller.interface";
import TYPES from "../inversify/inversify.types";
import { authorize } from "../middlewares/authorizeMiddleware";
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

const userController = container.get<IUserController>(TYPES.userController);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/google-login', userController.googleLogin);
router.post('/logout',auth, authorize(["User"]), userController.logout);
router.get('/fetch-data',auth, userController.fetchData);
router.post('/forgot-password', userController.forgotPass);
router.post('/resend-otp', userController.resendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/reset-password', userController.resetPassword);
router.get('/fetch-availability',auth, userController.fetchAvailability)
router.put('/update',auth, userController.update)
router.post('/find-users-byId',auth, userController.findUsersByIds)

export default router;