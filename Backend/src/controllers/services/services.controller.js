"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const response_1 = require("../../utilities/response");
const logger_1 = __importDefault(require("../../utilities/logger"));
const messages_1 = require("../../constants/messages");
const status_code_1 = require("../../constants/status.code");
let ServiceController = class ServiceController {
    constructor(serviceService) {
        this.createService = async (req, res, next) => {
            try {
                const service = req.body;
                const result = await this._serviceService.create(service);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.SERVICE_MESSAGE.CREATE_SERVICE_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.CREATE_SERVICE_FAILED, errMsg));
            }
        };
        this.getAllservices = async (req, res, next) => {
            try {
                const { currentPage, pageSize } = req.query;
                const { services, totalPage } = await this._serviceService.getAllServices(currentPage, pageSize);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.SERVICE_MESSAGE.GET_ALL_SERVICES_SUCCESS, { services, totalPage });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.GET_ALL_SERVICES_FAILED, errMsg));
            }
        };
        this.setIsActive = async (req, res, next) => {
            try {
                const { serviceId } = req.query;
                let result = await this._serviceService.setIsActive(serviceId);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.SERVICE_MESSAGE.UPDATE_SERVICE_STATUS_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.UPDATE_SERVICE_STATUS_FAILED, errMsg));
            }
        };
        this.update = async (req, res, next) => {
            try {
                const { serviceId, currentPage, pageSize } = req.query;
                const service = req.body;
                if (!serviceId) {
                    throw new Error(messages_1.SERVICE_MESSAGE.ID_NOT_RECEIVED);
                }
                if (service.name) {
                    const { services } = await this._serviceService.getAllServices(currentPage, pageSize);
                    ;
                    const existingNames = services
                        .filter(serv => serv._id.toString() !== serviceId)
                        .map(serv => serv.name.toLowerCase());
                    if (existingNames.includes(service.name.toLowerCase())) {
                        throw new Error(messages_1.SERVICE_MESSAGE.SERVICE_ALREADY_EXIST);
                    }
                }
                let result = await this._serviceService.update(service, serviceId);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.SERVICE_MESSAGE.UPDATE_SERVICE_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.UPDATE_SERVICE_FAILED, errMsg));
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const { serviceId } = req.query;
                let result = await this._serviceService.delete(serviceId);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.SERVICE_MESSAGE.DELETE_SERVICE_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.DELETE_SERVICE_FAILED, errMsg));
            }
        };
        this.getByCategories = async (req, res, next) => {
            try {
                const { categoryIds } = req.body;
                if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
                    throw new Error(messages_1.SERVICE_MESSAGE.ID_NOT_RECEIVED);
                }
                let result = await this._serviceService.getByCategories(categoryIds);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.SERVICE_MESSAGE.GET_SERVICE_BY_CATEGORIES_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.GET_SERVICE_BY_CATEGORIES_FAILED, errMsg));
            }
        };
        this.getByWorker = async (req, res, next) => {
            try {
                const { serviceIds } = req.body;
                console.log("CHECHKED IDS IS HERE :", serviceIds);
                if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
                    throw new Error(messages_1.SERVICE_MESSAGE.ID_NOT_RECEIVED);
                }
                let result = await this._serviceService.getByWorker(serviceIds);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.SERVICE_MESSAGE.GET_SERVICE_BY_WORKER_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.GET_SERVICE_BY_WORKER_FAILED, errMsg));
            }
        };
        this.getBySearch = async (req, res, next) => {
            try {
                const { search } = req.body;
                if (!search || typeof search !== "string") {
                    throw new Error(messages_1.SERVICE_MESSAGE.INVALID_SEARCH_KEY);
                }
                const result = await this._serviceService.getBySearch(search);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.SERVICE_MESSAGE.GET_SERVICE_BY_SEARCH_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.GET_SERVICE_BY_SEARCH_FAILED, errMsg));
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.query;
                if (!id) {
                    throw new Error(messages_1.SERVICE_MESSAGE.ID_NOT_RECEIVED);
                }
                const result = await this._serviceService.getById(id);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.SERVICE_MESSAGE.GET_ALL_SERVICES_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.SERVICE_MESSAGE.GET_ALL_SERVICES_FAILED, errMsg));
            }
        };
        this._serviceService = serviceService;
    }
};
exports.ServiceController = ServiceController;
exports.ServiceController = ServiceController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.serviceService)),
    __metadata("design:paramtypes", [Object])
], ServiceController);
