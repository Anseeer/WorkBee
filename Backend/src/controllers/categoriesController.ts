import { Request, Response } from "express"; 
import { CategoriesUsecase } from "../usecase/categories";
import { errorResponse, successResponse } from "../utilities/response";
import logger from "../utilities/logger";

export class categoriesController{
    private categoriesUsecase : CategoriesUsecase;
    constructor(categoriesUsecase:CategoriesUsecase){
        this.categoriesUsecase = categoriesUsecase;
    }

    getAllCategories = async(req:Request,res:Response)=>{
        try {
            const categories = await this.categoriesUsecase.getAllCategories();
            const response = new successResponse(201, 'SuccessFully GetAllCategories', {categories});
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
