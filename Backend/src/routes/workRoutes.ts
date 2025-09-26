import express from "express";
import container from "../inversify/inversify.container";
import { IWorkController } from "../controllers/work/work.controller.interface";
import TYPES from "../inversify/inversify.types";
import { auth } from "../middlewares/authMiddleware";

const Router = express.Router();

const WorkController = container.get<IWorkController>(TYPES.workController);

Router.post("/creat-work", auth, WorkController.createWork);
Router.get("/users", auth, WorkController.fetchWorkHistoryByUser);
Router.get("/workers", auth, WorkController.fetchWorkHistoryByWorker);
Router.patch("/cancel", auth, WorkController.cancelWork);
Router.patch("/accept", auth, WorkController.acceptWork);
Router.patch("/is-completed", auth, WorkController.completedWork);
Router.get("/details", auth, WorkController.workDetailsById);
Router.get("/works", auth, WorkController.getAllWorks);
Router.get("/assigned-works", auth, WorkController.getAssignedWorks);
Router.get("/requested-works", auth, WorkController.getRequestedWorks);
Router.get("/get-top-three", auth, WorkController.getTopThree);


export default Router;