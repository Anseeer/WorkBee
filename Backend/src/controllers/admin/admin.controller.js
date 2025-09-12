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
exports.AdminController = void 0;
const response_1 = require("../../utilities/response");
const logger_1 = __importDefault(require("../../utilities/logger"));
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const status_code_1 = require("../../constants/status.code");
const Cookie_1 = require("../../config/Cookie");
let AdminController = class AdminController {
    constructor(adminService) {
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new Error(messages_1.ADMIN_MESSAGES.MISSING_CREDENTIALS);
                }
                const { accessToken, refreshToken, admin } = await this._adminService.login(req.body);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.LOGIN_SUCCESS, { admin });
                res.cookie("accessToken", accessToken, {
                    httpOnly: Cookie_1.COOKIE_CONFIG.HTTP_ONLY,
                    sameSite: Cookie_1.COOKIE_CONFIG.SAME_SITE,
                    maxAge: Cookie_1.COOKIE_CONFIG.MAX_AGE,
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: Cookie_1.COOKIE_CONFIG.HTTP_ONLY,
                    sameSite: Cookie_1.COOKIE_CONFIG.SAME_SITE,
                    maxAge: Cookie_1.COOKIE_CONFIG.REFRESH_MAX_AGE,
                });
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.LOGIN_FAILED, errMsg));
            }
        };
        this.logout = async (req, res, next) => {
            try {
                res.clearCookie('accessToken', {
                    httpOnly: true,
                    sameSite: 'strict',
                });
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    sameSite: 'strict',
                });
                res.json({ message: messages_1.ADMIN_MESSAGES.LOGOUT_SUCCESS });
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.LOGOUT_FAILED, errMsg));
            }
        };
        this.fetchUsers = async (req, res, next) => {
            try {
                const { currentPage, pageSize } = req.query;
                const { users, totalPage } = await this._adminService.fetchUsers(currentPage, pageSize);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.FETCH_USERS_SUCCESS, { users, totalPage });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.FETCH_USERS_FAILED, errMsg));
            }
        };
        this.setIsActiveUsers = async (req, res, next) => {
            try {
                const id = req.query.id;
                await this._adminService.setIsActiveUsers(id);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.UPDATE_USERS_STATUS_SUCCESS, {});
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.UPDATE_USERS_STATUS_FAILED, errMsg));
            }
        };
        this.setIsActiveWorkers = async (req, res, next) => {
            try {
                const id = req.query.id;
                await this._adminService.setIsActiveWorkers(id);
                let response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.UPDATE_WORKERS_STATUS_SUCCESS, {});
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.UPDATE_WORKERS_STATUS_FAILED, errMsg));
            }
        };
        this.fetchWorkers = async (req, res, next) => {
            try {
                const { currentPage, pageSize } = req.query;
                const { workers, totalPage } = await this._adminService.fetchWorkers(currentPage, pageSize);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.FETCH_WORKERS_SUCCESS, { workers, totalPage });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.FETCH_WORKERS_FAILED, errMsg));
            }
        };
        this.fetchWorkersNonVerified = async (req, res, next) => {
            try {
                const workers = await this._adminService.fetchWorkersNonVerified();
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.FETCH_NON_VERIFIED_WORKERS_SUCCESS, workers);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.FETCH_NON_VERIFIED_WORKERS_FAILED, errMsg));
            }
        };
        this.fetchAvailability = async (req, res, next) => {
            try {
                const { workerId } = req.query;
                const availability = await this._adminService.fetchAvailability(workerId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.FETCH_AVAILABILITY_SUCCESS, availability);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.FETCH_AVAILABILITY_FAILED, errMsg));
            }
        };
        this.approveWorker = async (req, res, next) => {
            try {
                const { workerId } = req.query;
                const approved = await this._adminService.approveWorker(workerId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.APPROVE_WORKER_SUCCESS, approved);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.APPROVE_WORKER_FAILED, errMsg));
            }
        };
        this.rejectedWorker = async (req, res, next) => {
            try {
                const { workerId } = req.query;
                const rejected = await this._adminService.rejectedWorker(workerId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.ADMIN_MESSAGES.REJECT_WORKER_SUCCESS, rejected);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.ADMIN_MESSAGES.REJECT_WORKER_FAILED, errMsg));
            }
        };
        this._adminService = adminService;
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.adminService)),
    __metadata("design:paramtypes", [Object])
], AdminController);
