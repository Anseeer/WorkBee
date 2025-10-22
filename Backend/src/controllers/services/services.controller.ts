import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IServiceController } from "./services.controller.interface";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { NextFunction, Request, Response } from "express";
import { IServiceService } from "../../services/service/service.service.interface";
import { SERVICE_MESSAGE } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";

@injectable()
export class ServiceController implements IServiceController {
    private _serviceService: IServiceService;

    constructor(@inject(TYPES.serviceService) serviceService: IServiceService) {
        this._serviceService = serviceService;
    }

    createService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const service = req.body;
            const result = await this._serviceService.create(service);
            const response = new successResponse(StatusCode.CREATED, SERVICE_MESSAGE.CREATE_SERVICE_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.CREATE_SERVICE_FAILED, errMsg));
        }
    }


    getAllservices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentPage, pageSize } = req.query;
            const { services, totalPage } = await this._serviceService.getAllServices(currentPage as string, pageSize as string);
            const response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.GET_ALL_SERVICES_SUCCESS, { services, totalPage });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_ALL_SERVICES_FAILED, errMsg));
        }
    }

    setIsActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { serviceId } = req.query;
            let result = await this._serviceService.setIsActive(serviceId as string);
            let response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.UPDATE_SERVICE_STATUS_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.UPDATE_SERVICE_STATUS_FAILED, errMsg));
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { serviceId, currentPage, pageSize } = req.query;
            const service = req.body;
            console.log("Body :", service);
            if (!serviceId) {
                throw new Error(SERVICE_MESSAGE.ID_NOT_RECEIVED);
            }

            if (service.name) {
                const { services } = await this._serviceService.getAllServices(currentPage as string, pageSize as string);;
                const existingNames = services
                    .filter(serv => serv._id.toString() !== serviceId)
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
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.UPDATE_SERVICE_FAILED, errMsg));
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { serviceId } = req.query;
            let result = await this._serviceService.delete(serviceId as string);
            let response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.DELETE_SERVICE_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.DELETE_SERVICE_FAILED, errMsg));
        }
    }

    getByCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_SERVICE_BY_CATEGORIES_FAILED, errMsg));
        }
    }

    getByWorker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { serviceIds } = req.body;
            console.log("CHECHKED IDS IS HERE :", serviceIds)
            if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
                throw new Error(SERVICE_MESSAGE.ID_NOT_RECEIVED);
            }
            let result = await this._serviceService.getByWorker(serviceIds);
            let response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.GET_SERVICE_BY_WORKER_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_SERVICE_BY_WORKER_FAILED, errMsg));
        }
    }

    getBySearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_SERVICE_BY_SEARCH_FAILED, errMsg));
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.query;
            if (!id) {
                throw new Error(SERVICE_MESSAGE.ID_NOT_RECEIVED);
            }

            const result = await this._serviceService.getById(id as string);
            const response = new successResponse(StatusCode.OK, SERVICE_MESSAGE.GET_ALL_SERVICES_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            console.log("Error:", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, SERVICE_MESSAGE.GET_ALL_SERVICES_FAILED, errMsg));
        }
    };


}