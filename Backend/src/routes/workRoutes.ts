import express from "express";
import container from "../inversify/inversify.container";
import { IWorkController } from "../controllers/work/work.controller.interface";
import TYPES from "../inversify/inversify.types";
import { auth } from "../middlewares/authMiddleware";

const Router = express.Router();

const WorkController = container.get<IWorkController>(TYPES.workController);

Router.post("/creat-work", auth, WorkController.createWork);
Router.get("/users", auth, WorkController.fetchWorkHistoryByUser);
Router.delete("/delete", auth, WorkController.cancelWork);

export default Router;