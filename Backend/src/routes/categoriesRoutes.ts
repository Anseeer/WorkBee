import express from "express";
import container from "../inversify/inversify.container";
import { ICategoryController } from "../controllers/category/category.controller.interface";
import TYPES from "../inversify/inversify.types";

const Router = express.Router();

const categoryController = container.get<ICategoryController>(TYPES.categoryController);

Router.get("/getAllCategories", categoryController.getAllCategories);


export default Router;