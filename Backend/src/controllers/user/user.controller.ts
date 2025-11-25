import { NextFunction, Request, Response } from "express";
import logger from "../../utilities/logger";
import { errorResponse, successResponse } from "../../utilities/response";
import { IUserController } from "./user.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IUserService } from "../../services/user/user.service.interface";
import { USERS_MESSAGE } from "../../constants/messages";
import { StatusCode } from "../../constants/status.code";
import { COOKIE_CONFIG } from "../../config/Cookie";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ITempUserService } from "../../services/temp_user/temp.user.service.interface";

@injectable()
export class UserController implements IUserController {
    private _userService: IUserService;
    private _tempUserService: ITempUserService;
    constructor(
        @inject(TYPES.userService) userService: IUserService,
        @inject(TYPES.tempUserService) tempUserService: ITempUserService,
    ) {
        this._userService = userService
        this._tempUserService = tempUserService
    }

    registerTemp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = await this._tempUserService.register(req.body);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.REGISTER_TEMP_USER_SUCCESSFULLY, { userId });

            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.REGISTRATION_FAILED, errMsg));
        }
    }

    verifyRegister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user, accessToken, refreshToken, wallet } = await this._userService.verifyRegister(req.body);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.REGISTRATION_SUCCESS, { user, wallet });

            res.cookie("accessToken", accessToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                secure: COOKIE_CONFIG.SECURE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                secure: COOKIE_CONFIG.SECURE,
                maxAge: COOKIE_CONFIG.REFRESH_MAX_AGE,
            });

            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log("Error :", errMsg)
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.REGISTRATION_FAILED, errMsg));
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken, wallet } = await this._userService.loginUser(email, password);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.LOGIN_SUCCESS, { user, wallet });

            res.cookie("accessToken", accessToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                secure: COOKIE_CONFIG.SECURE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                secure: COOKIE_CONFIG.SECURE,
                maxAge: COOKIE_CONFIG.REFRESH_MAX_AGE,
            });

            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.LOGIN_FAILED, errMsg));
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            res.clearCookie("accessToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            res.json({ message: USERS_MESSAGE.LOGOUT_SUCCESS });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.LOGIN_FAILED, errMsg));
        }
    };

    forgotPass = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }
            const otp = await this._userService.forgotPass(email)
            logger.info("OTP :", otp);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.SUCCESSFULLY_SEND_OTP, { otp, email });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            logger.error("Error :", error)
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FAILD_SEND_OTP, errMsg));
        }
    }

    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }
            const otp = await this._userService.resendOtp(email);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.SUCCESSFULLY_RESEND_OTP, { otp });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FAILD_RESEND_OTP, errMsg));
        }
    }

    reVerifyRegister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.body;
            const otp = await this._tempUserService.resendOtp(userId);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.SUCCESSFULLY_RESEND_OTP, { otp });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FAILD_RESEND_OTP, errMsg));
        }
    }

    verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            await this._userService.verifyOtp(email, otp);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.VERIFY_OTP, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FAILED_VERIFY_OTP, errMsg));
        }

    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error(USERS_MESSAGE.CREDENTIALS_ARE_REQUIRED);
            }
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }
            await this._userService.resetPass(user.id, password);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.PASSWORD_RESET_SUCCESSFULLY, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.PASSWORD_RESET_FAILED, errMsg));
        }

    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentPass, newPass, userId } = req.body;
            if (!currentPass || !newPass || !userId) {
                throw new Error(USERS_MESSAGE.CREDENTIALS_ARE_REQUIRED);
            }
            await this._userService.changePass(userId, currentPass, newPass);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.PASSWORD_RESET_SUCCESSFULLY, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.PASSWORD_RESET_FAILED, errMsg));
        }

    };

    fetchAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { workerId } = req.query;
            const availability = await this._userService.fetchAvailability(workerId as string);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.FETCH_AVAILABILITY_SUCCESS, availability);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FETCH_AVAILABILITY_FAILD, errMsg));
        }
    }

    googleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { credential } = req.body;
            const { accessToken, refreshToken, user, wallet } = await this._userService.googleLogin(credential);

            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.GOOGLE_LOGIN_SUCCESS, { user, wallet });
            logger.info(response)
            res.cookie("accessToken", accessToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                secure: COOKIE_CONFIG.SECURE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                secure: COOKIE_CONFIG.SECURE,
                maxAge: COOKIE_CONFIG.REFRESH_MAX_AGE,
            });
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, errMsg || USERS_MESSAGE.GOOGLE_LOGIN_FAILED, errMsg));
        }
    }

    fetchData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let userId: string | undefined = undefined;

            if (
                req.query.userId !== undefined &&
                req.query.userId !== "undefined" &&
                req.query.userId !== ""
            ) {
                userId = String(req.query.userId);
            }

            if (!userId && (req as AuthRequest)?.user?.id) {
                userId = String((req as AuthRequest).user?.id);
            }

            if (!userId) {
                throw new Error(USERS_MESSAGE.USER_ID_NOT_GET);
            }

            const { user, wallet } = await this._userService.fetchData(userId as string);

            const response = new successResponse(
                StatusCode.OK,
                USERS_MESSAGE.FETCH_USER_SUCCESS,
                { user, wallet }
            );
            logger.info(response);
            res.status(response.status).json(response);

        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FETCH_USER_FAILD, errMsg));
        }
    };


    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userDetails, userId } = req.body
            const result = await this._userService.update(userDetails, userId);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.USER_UPDATE_SUCCESS, { result });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.USER_UPDATE_FAILD, errMsg));
        }
    }

    findUsersByIds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userIds } = req.body
            const result = await this._userService.findUsersByIds(userIds);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.FETCH_USER_SUCCESS, { result });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FETCH_USER_FAILD, errMsg));
        }
    }

}