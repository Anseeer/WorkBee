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
exports.WorkController = void 0;
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const response_1 = require("../../utilities/response");
const status_code_1 = require("../../constants/status.code");
const logger_1 = __importDefault(require("../../utilities/logger"));
const messages_1 = require("../../constants/messages");
let WorkController = class WorkController {
    constructor(workService) {
        this.createWork = async (req, res, next) => {
            try {
                const workDetails = req.body;
                const userId = req?.user?.id;
                workDetails.userId = userId;
                if (!workDetails) {
                    throw new Error(messages_1.WORK_MESSAGE.CANT_GET_WORK_DETAILS);
                }
                const result = await this._workService.createWork(workDetails);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.WORK_MESSAGE.WORK_CREATED_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORK_MESSAGE.WORK_CREATED_FAILD, errMsg));
            }
        };
        this.fetchWorkHistoryByUser = async (req, res, next) => {
            try {
                const userId = req?.user?.id;
                const { currentPage, pageSize } = req.query;
                if (!userId) {
                    throw new Error(messages_1.WORK_MESSAGE.USER_ID_NOT_GET);
                }
                const result = await this._workService.fetchWorkHistoryByUser(userId, currentPage, pageSize);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORK_MESSAGE.WORK_HISTORY_FETCH_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORK_MESSAGE.WORK_HISTORY_FETCH_FAILD, errMsg));
            }
        };
        this.fetchWorkHistoryByWorker = async (req, res, next) => {
            try {
                const { workerId, currentPage, pageSize } = req.query;
                if (!workerId) {
                    throw new Error(messages_1.WORK_MESSAGE.WORKER_ID_NOT_GET);
                }
                const result = await this._workService.fetchWorkHistoryByWorker(workerId, currentPage, pageSize);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORK_MESSAGE.WORK_HISTORY_FETCH_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORK_MESSAGE.WORK_HISTORY_FETCH_FAILD, errMsg));
            }
        };
        this.cancelWork = async (req, res, next) => {
            try {
                const { workId } = req.query;
                if (!workId) {
                    throw new Error(messages_1.WORK_MESSAGE.WORK_ID_NOT_GET);
                }
                const result = await this._workService.cancel(workId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORK_MESSAGE.WORK_CANCEL_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORK_MESSAGE.WORK_CANCEL_FAILD, errMsg));
            }
        };
        this.completedWork = async (req, res, next) => {
            try {
                const { workId, workerId } = req.query;
                if (!workId) {
                    throw new Error(messages_1.WORK_MESSAGE.WORK_ID_NOT_GET);
                }
                else if (!workerId) {
                    throw new Error(messages_1.WORK_MESSAGE.WORKER_ID_NOT_GET);
                }
                const result = await this._workService.completed(workId, workerId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORK_MESSAGE.WORK_COMPLETED_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORK_MESSAGE.WORK_COMPLETED_FAILD, errMsg));
            }
        };
        this.acceptWork = async (req, res, next) => {
            try {
                const { workId } = req.query;
                if (!workId) {
                    throw new Error(messages_1.WORK_MESSAGE.WORK_ID_NOT_GET);
                }
                const result = await this._workService.accept(workId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORK_MESSAGE.WORK_ACCEPT_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log(error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORK_MESSAGE.WORK_ACCEPT_FAILD, errMsg));
            }
        };
        this.workDetailsById = async (req, res, next) => {
            try {
                const { workId } = req.query;
                if (!workId) {
                    throw new Error(messages_1.WORK_MESSAGE.WORK_ID_NOT_GET);
                }
                const result = await this._workService.workDetails(workId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORK_MESSAGE.WORK_DETAILS_GET_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORK_MESSAGE.WORK_DETAILS_GET_FAILD, errMsg));
            }
        };
        this.getAllWorks = async (req, res, next) => {
            try {
                const { currentPage, pageSize } = req.query;
                const { paginatedWorks, totalPage } = await this._workService.getAllWorks(currentPage, pageSize);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORK_MESSAGE.WORK_DETAILS_GET_SUCCESS, { paginatedWorks, totalPage });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORK_MESSAGE.WORK_DETAILS_GET_FAILD, errMsg));
            }
        };
        this._workService = workService;
    }
};
exports.WorkController = WorkController;
exports.WorkController = WorkController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.workService)),
    __metadata("design:paramtypes", [Object])
], WorkController);
