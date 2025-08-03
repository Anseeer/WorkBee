import { inject, injectable } from "inversify";
import { ServiceService } from "../../services/service/service.service";
import TYPES from "../../inversify/inversify.types";
import { IServiceController } from "./services.controller.interface";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { Request, Response } from "express";
import { IServices } from "../../model/service/service.interface";

@injectable()
export class ServiceController implements IServiceController {
    private _serviceService: ServiceService;

    constructor(@inject(TYPES.serviceService) serviceService: ServiceService) {
        this._serviceService = serviceService;
    }

    createService = async (req: Request, res: Response) => {
        try {
            const service = req.body;
            const result = await this._serviceService.create(service);
            const response = new successResponse(201, "Successfully Create Service", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Create Service', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }


    getAllservices = async (req: Request, res: Response) => {
        try {
            const service = await this._serviceService.getAllServices();
            const response = new successResponse(201, 'SuccessFully GetAllServices', { service });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To GetAllServices', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    setIsActive = async (req: Request, res: Response): Promise<void> => {
        try {
            const { serviceId } = req.query;
            let result = await this._serviceService.setIsActive(serviceId as string);
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

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { serviceId } = req.query;
            const service = req.body;
            let result = await this._serviceService.update(service, serviceId as string);
            let response = new successResponse(201, "SuccessFully Updated", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To Updated', message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { serviceId } = req.query;
            let result = await this._serviceService.delete(serviceId as string);
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

    getByCategories = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryIds } = req.body;
            if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
                throw new Error("Empty or invalid categoryId");
            }
            let result = await this._serviceService.getByCategories(categoryIds);
            let response = new successResponse(201, "SuccessFully GetByCategories", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To GetByCategories', message);
            logger.error(response);
            console.log("Error :", response)
            res.status(response.status).json(response);
        }
    }

    getByWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const { serviceIds } = req.body;
            if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
                throw new Error("Empty or invalid serviceIds");
            }
            let result = await this._serviceService.getByWorker(serviceIds);
            let response = new successResponse(201, "SuccessFully GetByworker", result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, 'Faild To GetByWorker', message);
            logger.error(response);
            console.log("Error :", response)
            res.status(response.status).json(response);
        }
    }

}