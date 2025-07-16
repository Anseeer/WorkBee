import express from "express"; "../controllers/categoriesController";
import { CategoryRepository } from "../repositories/category/category.repo";
import { CategoryService } from "../services/category/category.service";
import { CategoryController } from "../controllers/category/category.controller";

const Router = express.Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

Router.get("/getAllCategories", categoryController.getAllCategories);


export default Router;