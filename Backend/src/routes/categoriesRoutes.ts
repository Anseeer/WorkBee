import express from "express";
import { categoriesRepository } from "../repository/categoriesRepository";
import { CategoriesUsecase } from "../usecase/categories";
import { categoriesController } from "../controllers/categoriesController";

const Router = express.Router();

const CategoriesRepo = new categoriesRepository();
const categoriesUsecase = new CategoriesUsecase(CategoriesRepo);
const CategoriesController = new categoriesController(categoriesUsecase);

Router.get("/getAllCategories",CategoriesController.getAllCategories);


export default Router;