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
exports.UserController = void 0;
const logger_1 = __importDefault(require("../../utilities/logger"));
const response_1 = require("../../utilities/response");
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const status_code_1 = require("../../constants/status.code");
const Cookie_1 = require("../../config/Cookie");
let UserController = class UserController {
    constructor(userService, chatService) {
        this.register = async (req, res, next) => {
            try {
                const { user, accessToken, refreshToken, wallet } = await this._userService.registerUser(req.body);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.USERS_MESSAGE.REGISTRATION_SUCCESS, { user, wallet });
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
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.REGISTRATION_FAILED, errMsg));
            }
        };
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const { user, accessToken, refreshToken, wallet } = await this._userService.loginUser(email, password);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.USERS_MESSAGE.LOGIN_SUCCESS, { user, wallet });
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
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.LOGIN_FAILED, errMsg));
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
                res.json({ message: messages_1.USERS_MESSAGE.LOGOUT_SUCCESS });
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.LOGIN_FAILED, errMsg));
            }
        };
        this.forgotPass = async (req, res, next) => {
            try {
                const { email } = req.body;
                const user = await this._userService.getUserByEmail(email);
                if (!user) {
                    throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
                }
                const otp = await this._userService.forgotPass(email);
                logger_1.default.info("OTP :", otp);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.USERS_MESSAGE.SUCCESSFULLY_SEND_OTP, { otp, email });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.FAILD_SEND_OTP, errMsg));
            }
        };
        this.resendOtp = async (req, res, next) => {
            try {
                const { email } = req.body;
                const user = await this._userService.getUserByEmail(email);
                if (!user) {
                    throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
                }
                const otp = await this._userService.resendOtp(email);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.USERS_MESSAGE.SUCCESSFULLY_RESEND_OTP, { otp });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.FAILD_RESEND_OTP, errMsg));
            }
        };
        this.verifyOtp = async (req, res, next) => {
            try {
                const { email, otp } = req.body;
                await this._userService.verifyOtp(email, otp);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.USERS_MESSAGE.VERIFY_OTP, {});
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.FAILED_VERIFY_OTP, errMsg));
            }
        };
        this.resetPassword = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new Error(messages_1.USERS_MESSAGE.CREDENTIALS_ARE_REQUIRED);
                }
                const user = await this._userService.getUserByEmail(email);
                if (!user) {
                    throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
                }
                await this._userService.resetPass(email, password);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.USERS_MESSAGE.PASSWORD_RESET_SUCCESSFULLY, {});
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.PASSWORD_RESET_FAILED, errMsg));
            }
        };
        this.fetchAvailability = async (req, res, next) => {
            try {
                const { workerId } = req.query;
                const availability = await this._userService.fetchAvailability(workerId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.USERS_MESSAGE.FETCH_AVAILABILITY_SUCCESS, availability);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.FETCH_AVAILABILITY_FAILD, errMsg));
            }
        };
        this.googleLogin = async (req, res, next) => {
            try {
                const { credential } = req.body;
                const { accessToken, refreshToken, user, wallet } = await this._userService.googleLogin(credential);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.USERS_MESSAGE.GOOGLE_LOGIN_SUCCESS, { user, wallet });
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
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.GOOGLE_LOGIN_FAILED, errMsg));
            }
        };
        this.fetchData = async (req, res, next) => {
            try {
                let userId = undefined;
                if (req.query.userId !== undefined &&
                    req.query.userId !== "undefined" &&
                    req.query.userId !== "") {
                    userId = String(req.query.userId);
                }
                if (!userId && req?.user?.id) {
                    userId = String(req.user?.id);
                }
                if (!userId) {
                    throw new Error(messages_1.USERS_MESSAGE.USER_ID_NOT_GET);
                }
                const { user, wallet } = await this._userService.fetchData(userId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.USERS_MESSAGE.FETCH_USER_SUCCESS, { user, wallet });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.FETCH_USER_FAILD, errMsg));
            }
        };
        this.update = async (req, res, next) => {
            try {
                const { userDetails, userId } = req.body;
                const result = await this._userService.update(userDetails, userId);
                const response = new response_1.successResponse(status_code_1.StatusCode.CREATED, messages_1.USERS_MESSAGE.USER_UPDATE_SUCCESS, { result });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.USER_UPDATE_FAILD, errMsg));
            }
        };
        this.findUsersByIds = async (req, res, next) => {
            try {
                const { userIds } = req.body;
                const result = await this._userService.findUsersByIds(userIds);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.USERS_MESSAGE.FETCH_USER_SUCCESS, { result });
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.USERS_MESSAGE.FETCH_USER_FAILD, errMsg));
            }
        };
        this._userService = userService;
        this._chatService = chatService;
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.userService)),
    __param(1, (0, inversify_1.inject)(inversify_types_1.default.chatService)),
    __metadata("design:paramtypes", [Object, Object])
], UserController);
