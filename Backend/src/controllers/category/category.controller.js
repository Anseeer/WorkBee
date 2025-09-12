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
exports.CategoryController = void 0;
const response_1 = require("../../utilities/response");
const logger_1 = __importDefault(require("../../utilities/logger"));
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const status_code_1 = require("../../constants/status.code");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.getAll = async (req, res, next) => {
            try {
                const { currentPage, pageSize } = req.query;
                const { category, totalPage } = await this._categoryService.getAll(currentPage, pageSize);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.CATEGORY_MESSAGE.GET_ALL_CATEGORIES_SUCCESS, { category, totalPage });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.CATEGORY_MESSAGE.GET_ALL_CATEGORIES_FAILED, errMsg));
            }
        };
        this.createCategory = async (req, res, next) => {
            try {
                const { name, description, imageUrl } = req.body;
                const categoryData = {
                    name,
                    description,
                    imageUrl,
                    isActive: true,
                };
                const result = await this._categoryService.createCategory(categoryData);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.CATEGORY_MESSAGE.CREATE_CATEGORY_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.CATEGORY_MESSAGE.CREATE_CATEGORY_FAILED, errMsg));
            }
        };
        this.update = async (req, res, next) => {
            try {
                const { currentPage, pageSize, categoryId } = req.query;
                const { name, description, imageUrl } = req.body;
                if (!categoryId) {
                    throw new Error(messages_1.CATEGORY_MESSAGE.ID_NOT_RECEIVED);
                }
                if (name) {
                    const { category } = await this._categoryService.getAll(currentPage, pageSize);
                    const existingNames = category
                        .filter(cat => cat?._id.toString() !== categoryId)
                        .map(cat => cat.name.toLowerCase());
                    if (existingNames.includes(name.toLowerCase())) {
                        throw new Error(messages_1.CATEGORY_MESSAGE.CATEGORY_ALREADY_EXISTS);
                    }
                }
                const updateData = {
                    name,
                    description,
                    imageUrl,
                };
                const result = await this._categoryService.update(updateData, categoryId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.CATEGORY_MESSAGE.UPDATE_CATEGORY_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.CATEGORY_MESSAGE.UPDATE_CATEGORY_FAILED, errMsg));
            }
        };
        this.setIsActive = async (req, res, next) => {
            try {
                const { categoryId } = req.query;
                let result = await this._categoryService.setIsActive(categoryId);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.CATEGORY_MESSAGE.UPDATE_CATEGORY_STATUS_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.CATEGORY_MESSAGE.UPDATE_CATEGORY_STATUS_FAILED, errMsg));
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const { categoryId } = req.query;
                let result = await this._categoryService.delete(categoryId);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.CATEGORY_MESSAGE.DELETE_CATEGORY_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.CATEGORY_MESSAGE.DELETE_CATEGORY_FAILED, errMsg));
            }
        };
        this.getByWorker = async (req, res, next) => {
            try {
                const { categoryIds } = req.body;
                let result = await this._categoryService.getByWorker(categoryIds);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.CATEGORY_MESSAGE.GET_CATEGORIES_BY_WORKER_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.CATEGORY_MESSAGE.GET_CATEGORIES_BY_WORKER_FAILED, errMsg));
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.query;
                if (!id) {
                    throw new Error(messages_1.CATEGORY_MESSAGE.ID_NOT_RECEIVED);
                }
                const result = await this._categoryService.getById(id);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.CATEGORY_MESSAGE.GET_ALL_CATEGORIES_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error:", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.CATEGORY_MESSAGE.GET_ALL_CATEGORIES_FAILED, errMsg));
            }
        };
        this._categoryService = categoryService;
    }
};
exports.CategoryController = CategoryController;
exports.CategoryController = CategoryController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.categoryService)),
    __metadata("design:paramtypes", [Object])
], CategoryController);
