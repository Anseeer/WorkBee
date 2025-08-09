import express from "express";
import container from "../inversify/inversify.container";
import { IWorkController } from "../controllers/work/work.controller.interface";
import TYPES from "../inversify/inversify.types";

const Router = express.Router();

const WorkController = container.get<IWorkController>(TYPES.workController);

Router.post("/create-work", WorkController.createWork);

export default Router;