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

export default router;