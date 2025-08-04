import { Request, Response } from "express";
import { CategoryService } from "../../services/category/category.service";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { ICategoryController } from "./category.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { ICategory } from "../../model/category/category.interface";

@injectable()
export class CategoryController implements ICategoryController {
    private _categoryService: CategoryService;
    constructor(@inject(TYPES.categoryService) categoryService: CategoryService) {
        this._categoryService = categoryService;
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const categories = await this._categoryService.getAll();
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

    createCategory = async (req: Request, res: Response) => {
        try {
            const { name, description, imageUrl } = req.body;

            const categoryData: Partial<ICategory> = {
                name,
                description,
                imageUrl,
                isActive: true,
            };

            const result = await this._categoryService.createCategory(categoryData as ICategory);
            const response = new successResponse(201, "Successfully Created Category", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Failed To Create Category', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryId } = req.query;
            const { name, description, imageUrl } = req.body;

            const updateData: Partial<ICategory> = {
                name,
                description,
                imageUrl,
            };

            const result = await this._categoryService.update(updateData as ICategory, categoryId as string);
            const response = new successResponse(201, "Successfully Updated", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Failed To Update', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };

    setIsActive = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryId } = req.query;
            let result = await this._categoryService.setIsActive(categoryId as string);
            let response = new successResponse(201, "SuccessFully SetIsActive", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To SetIsActive', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryId } = req.query;
            let result = await this._categoryService.delete(categoryId as string);
            let response = new successResponse(201, "SuccessFully Deleted", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Delete', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    getByWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryIds } = req.body;
            let result = await this._categoryService.getByWorker(categoryIds);
            let response = new successResponse(201, "SuccessFully GetByWorker", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To GetByWorker', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

}
