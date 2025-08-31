import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { ICategoryController } from "./category.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { ICategory } from "../../model/category/category.interface";
import { ICategoryService } from "../../services/category/category.service.interface";
import { CATEGORY_MESSAGE } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";

@injectable()
export class CategoryController implements ICategoryController {
    private _categoryService: ICategoryService;
    constructor(@inject(TYPES.categoryService) categoryService: ICategoryService) {
        this._categoryService = categoryService;
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const { currentPage, pageSize } = req.query;
            const { category, totalPage } = await this._categoryService.getAll(currentPage as string, pageSize as string);
            const response = new successResponse(StatusCode.OK, CATEGORY_MESSAGE.GET_ALL_CATEGORIES_SUCCESS, { category, totalPage });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, CATEGORY_MESSAGE.GET_ALL_CATEGORIES_FAILED, message);
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
            const response = new successResponse(StatusCode.CREATED, CATEGORY_MESSAGE.CREATE_CATEGORY_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, CATEGORY_MESSAGE.CREATE_CATEGORY_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { currentPage, pageSize, categoryId } = req.query
            const { name, description, imageUrl } = req.body;

            if (!categoryId) {
                throw new Error(CATEGORY_MESSAGE.ID_NOT_RECEIVED);
            }

            if (name) {
                const { category, totalPage } = await this._categoryService.getAll(currentPage as string, pageSize as string);
                const existingNames = category
                    .filter(cat => cat?._id.toString() !== categoryId)
                    .map(cat => cat.name.toLowerCase());

                if (existingNames.includes(name.toLowerCase())) {
                    throw new Error(CATEGORY_MESSAGE.CATEGORY_ALREADY_EXISTS);
                }
            }

            const updateData: Partial<ICategory> = {
                name,
                description,
                imageUrl,
            };

            const result = await this._categoryService.update(updateData as ICategory, categoryId as string);
            const response = new successResponse(StatusCode.OK, CATEGORY_MESSAGE.UPDATE_CATEGORY_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, CATEGORY_MESSAGE.UPDATE_CATEGORY_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };

    setIsActive = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryId } = req.query;
            let result = await this._categoryService.setIsActive(categoryId as string);
            let response = new successResponse(StatusCode.OK, CATEGORY_MESSAGE.UPDATE_CATEGORY_STATUS_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, CATEGORY_MESSAGE.UPDATE_CATEGORY_STATUS_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryId } = req.query;
            let result = await this._categoryService.delete(categoryId as string);
            let response = new successResponse(StatusCode.OK, CATEGORY_MESSAGE.DELETE_CATEGORY_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, CATEGORY_MESSAGE.DELETE_CATEGORY_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    getByWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryIds } = req.body;
            let result = await this._categoryService.getByWorker(categoryIds);
            let response = new successResponse(StatusCode.OK, CATEGORY_MESSAGE.GET_CATEGORIES_BY_WORKER_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, CATEGORY_MESSAGE.GET_CATEGORIES_BY_WORKER_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }


    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.query;
            if (!id) {
                throw new Error(CATEGORY_MESSAGE.ID_NOT_RECEIVED);
            }

            const result = await this._categoryService.getById(id as string);
            const response = new successResponse(StatusCode.OK, CATEGORY_MESSAGE.GET_ALL_CATEGORIES_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, CATEGORY_MESSAGE.GET_ALL_CATEGORIES_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };

}
