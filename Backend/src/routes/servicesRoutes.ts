import express from "express";
import { IServiceController } from "../controllers/services/services.controller.interface";
import TYPES from "../inversify/inversify.types";
import container from "../inversify/inversify.container";

const serviceController = container.get<IServiceController>(TYPES.serviceController);

const Router = express.Router();

Router.post('/create-service', serviceController.createService);
Router.get("/getAll-services", serviceController.getAllservices);
Router.get("/set-active", serviceController.setIsActive);
Router.post("/update", serviceController.update);
Router.delete("/delete", serviceController.delete);

export default Router;