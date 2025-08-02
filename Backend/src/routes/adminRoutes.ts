import express from "express";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { IAdminController } from "../controllers/admin/admin.controller.interface";
import { auth } from "../middlewares/authMiddleware";

const adminController = container.get<IAdminController>(TYPES.adminController)

const Router = express.Router();

Router.post('/login', adminController.login);
Router.post('/logout', auth, adminController.logout);
Router.get('/users', auth, adminController.fetchUsers)
Router.get('/users/set-status', auth, adminController.setIsActiveUsers);
Router.get('/workers/set-status', auth, adminController.setIsActiveWorkers);
Router.get('/workers', auth, adminController.fetchWorkers)
Router.get('/fetch-availability', auth, adminController.fetchAvailability)


export default Router;