import express from "express";
import container from "../inversify/inversify.container";
import { ICategoryController } from "../controllers/category/category.controller.interface";
import TYPES from "../inversify/inversify.types";

const Router = express.Router();

const categoryController = container.get<ICategoryController>(TYPES.categoryController);

Router.get("/getAll-categories", categoryController.getAllCategories);
Router.post("/create-category", categoryController.createCategory);
Router.get("/set-active", categoryController.setIsActive);
Router.post("/update", categoryController.update);
Router.delete("/delete", categoryController.delete);


export default Router;