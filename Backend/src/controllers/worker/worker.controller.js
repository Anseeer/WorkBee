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
exports.WorkerController = void 0;
const response_1 = require("../../utilities/response");
const logger_1 = __importDefault(require("../../utilities/logger"));
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const status_code_1 = require("../../constants/status.code");
const Cookie_1 = require("../../config/Cookie");
let WorkerController = class WorkerController {
    constructor(workerService, walletService, availabilityService) {
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new Error(messages_1.WORKER_MESSAGE.EMAIL_AND_PASS_REQUIRED);
                }
                const credentials = { email, password };
                const { accessToken, refreshToken, worker, wallet, availability } = await this._workerService.loginWorker(credentials);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.WORKER_MESSAGE.LOGIN_SUCCESS, { worker, availability, wallet });
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
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.LOGIN_FAILD, errMsg));
            }
        };
        this.register = async (req, res, next) => {
            try {
                const { accessToken, refreshToken, worker, wallet } = await this._workerService.registerWorker(req.body);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.WORKER_MESSAGE.REGISTRATION_SUCCESS, { worker, wallet });
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
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error ::", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.REGISTRATION_FAILD, errMsg));
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
                res.json({ message: messages_1.WORKER_MESSAGE.LOGOUT_SUCCESs });
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.LOGOUT_FAILD, errMsg));
            }
        };
        this.buildAccount = async (req, res, next) => {
            const { workerId } = req.query;
            try {
                if (!workerId || typeof workerId !== "string") {
                    throw new Error(messages_1.WORKER_MESSAGE.Availability_or_WorkerID_In_Availability_Not_Get);
                }
                const { availability, ...workerData } = req.body;
                const result = await this._workerService.buildAccount(workerId, availability, workerData);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.WORKER_MESSAGE.WORKER_ACCOUNT_BUILD_SUCCESSFULLY, {
                    worker: result.updatedWorker,
                    availability: result.updatedAvailability
                });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.WORKER_ACCOUNT_BUILD_FAILD, errMsg));
                ;
            }
        };
        this.forgotPass = async (req, res, next) => {
            try {
                const { email } = req.body;
                const user = await this._workerService.getUserByEmail(email);
                if (!user) {
                    throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
                }
                const otp = await this._workerService.forgotPass(email);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORKER_MESSAGE.SUCCESSFULLUY_SEND_OTP, { otp, email });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.FAILD_SEND_OTP, errMsg));
            }
        };
        this.resendOtp = async (req, res, next) => {
            try {
                const { email } = req.body;
                const user = await this._workerService.getUserByEmail(email);
                if (!user) {
                    throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
                }
                const otp = await this._workerService.resendOtp(email);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORKER_MESSAGE.SUCCESSFULLUY_RESEND_OTP, { otp });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.FAILD_RESEND_OTP, errMsg));
            }
        };
        this.verifyOtp = async (req, res, next) => {
            try {
                const { email, otp } = req.body;
                await this._workerService.verifyOtp(email, otp);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORKER_MESSAGE.VERIFY_OTP, {});
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.FAILD_VERIFY_OTP, errMsg));
            }
        };
        this.resetPassword = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new Error(messages_1.WORKER_MESSAGE.EMAIL_AND_PASS_REQUIRED);
                }
                const user = await this._workerService.getUserByEmail(email);
                if (!user) {
                    throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
                }
                await this._workerService.resetPass(email, password);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORKER_MESSAGE.PASSWORD_RESET_SUCCESSFULLY, {});
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.PASSWORD_RESET_FAILD, errMsg));
            }
        };
        this.fetchDetails = async (req, res, next) => {
            const workerId = req.query.workerId;
            try {
                if (!workerId || typeof workerId !== "string") {
                    throw new Error(messages_1.WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
                }
                const worker = await this._workerService.getUserById(workerId);
                const wallet = await this._walletService.findByUser(worker?.id);
                const availability = await this._availabilityService.getAvailabilityByworkerId(workerId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORKER_MESSAGE.WORKER_DETAILS_FETCH_SUCCESSFULLY, {
                    worker,
                    wallet,
                    availability
                });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                console.log("Error :", error);
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.WORKER_DETAILS_FETCH_FAILD, errMsg));
            }
        };
        this.updateWorker = async (req, res, next) => {
            try {
                const { workerData } = req.body;
                const worker = workerData.worker;
                const availability = workerData.availability;
                if (!worker || !worker._id) {
                    throw new Error(messages_1.WORKER_MESSAGE.WORKER_DATA_OR_ID_NOT_GET);
                }
                if (!availability || !availability.workerId) {
                    throw new Error(messages_1.WORKER_MESSAGE.Availability_or_WorkerID_In_Availability_Not_Get);
                }
                await this._availabilityService.updateAvailability(availability);
                await this._workerService.updateWorker(worker);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.WORKER_MESSAGE.UPDATE_WORKER_SUCCESSFULLY, {});
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.UPDATE_WORKER_FAILD, errMsg));
            }
        };
        this.searchWorker = async (req, res, next) => {
            try {
                const searchTerms = req.body;
                if (!searchTerms) {
                    throw new Error(messages_1.SEARCH_TERMS.TERM_NOT_EXIST);
                }
                const workers = await this._workerService.searchWorker(searchTerms);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORKER_MESSAGE.GET_WORKERS_SUCCESSFULL, { workers });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.GET_WORKERS_FAILD, errMsg));
            }
        };
        this.findWorkersByIds = async (req, res, next) => {
            try {
                const { workerIds } = req.body;
                if (!workerIds) {
                    throw new Error(messages_1.WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
                }
                const workers = await this._workerService.findWorkersByIds(workerIds);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WORKER_MESSAGE.GET_WORKERS_SUCCESSFULL, { workers });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.GET_WORKERS_FAILD, errMsg));
            }
        };
        this.googleLogin = async (req, res, next) => {
            try {
                const { credential } = req.body;
                const { accessToken, refreshToken, worker, wallet, availability } = await this._workerService.googleLogin(credential);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.WORKER_MESSAGE.GOOGLE_LOGIN_SUCCESS, { worker, wallet, availability });
                logger_1.default.info(response);
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
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WORKER_MESSAGE.GOOGLE_LOGIN_FAILED, errMsg));
            }
        };
        this.findWallet = async (req, res, next) => {
            try {
                const workerId = req.query.workerId;
                if (!workerId || typeof workerId !== 'string') {
                    throw new Error(messages_1.WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
                }
                const wallet = await this._workerService.findWallet(workerId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.WALLET_MESSAGE.WALLET_GET_SUCCESSFULL, { wallet });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.WALLET_MESSAGE.WALLET_GET_FAILD, errMsg));
            }
        };
        this._workerService = workerService;
        this._walletService = walletService;
        this._availabilityService = availabilityService;
    }
};
exports.WorkerController = WorkerController;
exports.WorkerController = WorkerController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.workerService)),
    __param(1, (0, inversify_1.inject)(inversify_types_1.default.walletService)),
    __param(2, (0, inversify_1.inject)(inversify_types_1.default.availabilityService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], WorkerController);
