import express from "express";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { IAdminController } from "../controllers/admin/admin.controller.interface";
import { authorize } from "../middlewares/authorizeMiddleware";
import { auth } from "../middlewares/authMiddleware";

const adminController = container.get<IAdminController>(TYPES.adminController)

const Router = express.Router();

Router.post('/login', adminController.login);
Router.post('/logout', auth, authorize(["Admin"]), adminController.logout);
Router.get('/users', auth, authorize(["Admin"]), adminController.fetchUsers)
Router.patch('/users/set-status', auth, authorize(["Admin"]), adminController.setIsActiveUsers);
Router.patch('/workers/set-status', auth, authorize(["Admin"]), adminController.setIsActiveWorkers);
Router.get('/workers', auth, authorize(["Admin"]), adminController.fetchWorkers)
Router.get('/workers-nonVerify', auth, adminController.fetchWorkersNonVerified)
Router.get('/fetch-availability', auth, authorize(["Admin"]), adminController.fetchAvailability)
Router.patch('/approve-worker', auth, authorize(["Admin"]), adminController.approveWorker)
Router.patch('/reject-worker', auth, authorize(["Admin"]), adminController.rejectedWorker)
Router.get('/earnings', auth, authorize(["Admin"]), adminController.fetchEarnings)
Router.get('/wallet', auth, authorize(["Admin"]), adminController.platformWallet)


export default Router;