import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IServiceController } from "./services.controller.interface";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { Request, Response } from "express";
import { IServiceService } from "../../services/service/service.service.interface";
import { SERVICE_MESSAGE } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";

@injectable()
export class ServiceController implements IServiceController {
    private _serviceService: IServiceService;

    constructor(@inject(TYPES.serviceService) serviceService: IServiceService) {
        this._serviceService = serviceService;
    }

    createService = async (req: Request, res: Response) => {
        try {
            const service = req.body;
            const result = await this._serviceService.create(service);
            const response = new successResponse(StatusCode.CREATED, SERVICE_MESSAGE.CREATE_SERVICE_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.CREATE_SERVICE_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }


    getAllservices = async (req: Request, res: Response) => {
        try {
            const service = await this._serviceService.getAllServices();
            const response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.GET_ALL_SERVICES_SUCCESS, { service });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_ALL_SERVICES_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    setIsActive = async (req: Request, res: Response): Promise<void> => {
        try {
            const { serviceId } = req.query;
            let result = await this._serviceService.setIsActive(serviceId as string);
            let response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.UPDATE_SERVICE_STATUS_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.UPDATE_SERVICE_STATUS_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { serviceId } = req.query;
            const service = req.body;

            if (!serviceId) {
                throw new Error(SERVICE_MESSAGE.ID_NOT_RECEIVED);
            }

            if (service.name) {
                const allOtherServices = await this._serviceService.getAllServices();
                const existingNames = allOtherServices
                    .filter(serv => serv.id.toString() !== serviceId)
                    .map(serv => serv.name.toLowerCase());

                if (existingNames.includes(service.name.toLowerCase())) {
                    throw new Error(SERVICE_MESSAGE.SERVICE_ALREADY_EXIST);
                }
            }

            let result = await this._serviceService.update(service, serviceId as string);
            let response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.UPDATE_SERVICE_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.UPDATE_SERVICE_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { serviceId } = req.query;
            let result = await this._serviceService.delete(serviceId as string);
            let response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.DELETE_SERVICE_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.DELETE_SERVICE_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    getByCategories = async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoryIds } = req.body;
            if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
                throw new Error(SERVICE_MESSAGE.ID_NOT_RECEIVED);
            }
            let result = await this._serviceService.getByCategories(categoryIds);
            let response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.GET_SERVICE_BY_CATEGORIES_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_SERVICE_BY_CATEGORIES_FAILED, message);
            logger.error(response);
            console.log("Error :", response)
            res.status(response.status).json(response);
        }
    }

    getByWorker = async (req: Request, res: Response): Promise<void> => {
        try {
            const { serviceIds } = req.body;
            if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
                throw new Error(SERVICE_MESSAGE.ID_NOT_RECEIVED);
            }
            let result = await this._serviceService.getByWorker(serviceIds);
            let response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.GET_SERVICE_BY_WORKER_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_SERVICE_BY_WORKER_FAILED, message);
            logger.error(response);
            console.log("Error :", response)
            res.status(response.status).json(response);
        }
    }

    getBySearch = async (req: Request, res: Response): Promise<void> => {
        try {
            const { search } = req.body;
            if (!search || typeof search !== "string") {
                throw new Error(SERVICE_MESSAGE.INVALID_SEARCH_KEY);
            }

            const result = await this._serviceService.getBySearch(search);
            const response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.GET_SERVICE_BY_SEARCH_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_SERVICE_BY_SEARCH_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


}