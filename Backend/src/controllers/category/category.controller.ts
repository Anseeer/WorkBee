import { Request, Response } from "express";
import { CategoryService } from "../../services/category/category.service";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { ICategoryController } from "./category.controller.interface";

export class CategoryController implements ICategoryController {
    private _categoryService: CategoryService;
    constructor(_categoryService: CategoryService) {
        this._categoryService = _categoryService;
    }

    getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this._categoryService.getAllCategories();
            const response = new successResponse(201, 'SuccessFully GetAllCategories', { categories });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To GetAllCategories', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

}
