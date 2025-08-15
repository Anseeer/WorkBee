import { Request, Response } from "express";
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

@injectable()
export class UserController implements IUserController {
    private _userService: IUserService;
    constructor(@inject(TYPES.userService) userService: IUserService) {
        this._userService = userService
    }

    register = async (req: Request, res: Response) => {
        try {
            const { user, token, wallet } = await this._userService.registerUser(req.body);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.REGISTRATION_SUCCESS, { user, wallet });
            res.cookie("token", token, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                secure: COOKIE_CONFIG.SECURE,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.REGISTRATION_FAILED, message);
            logger.error("Error", response)
            res.status(response.status).json(response);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const { user, token, wallet } = await this._userService.loginUser(email, password);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.LOGIN_SUCCESS, { user, wallet });
            res.cookie("token", token, {
                httpOnly: COOKIE_CONFIG.HTTP_ONLY,
                secure: COOKIE_CONFIG.SECURE,
                sameSite: COOKIE_CONFIG.SAME_SITE,
                maxAge: COOKIE_CONFIG.MAX_AGE,
            });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.LOGIN_FAILED, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.json({ message: USERS_MESSAGE.LOGOUT_SUCCESS });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.LOGOUT_FAILED, errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };

    forgotPass = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error(USERS_MESSAGE.CAT_FIND_USER);
            }
            const otp = await this._userService.forgotPass(email)
            logger.info("OTP :", otp);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.SUCCESSFULLY_SEND_OTP, { otp, email });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FAILD_SEND_OTP, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    resendOtp = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error(USERS_MESSAGE.CAT_FIND_USER);
            }
            const otp = await this._userService.resendOtp(email);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.SUCCESSFULLY_RESEND_OTP, { otp });
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FAILD_RESEND_OTP, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    verifyOtp = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            await this._userService.verifyOtp(email, otp);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.VERIFY_OTP, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FAILED_VERIFY_OTP, message);
            logger.error(response)
            res.status(response.status).json(response);
        }

    }

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error(USERS_MESSAGE.CREDENTIALS_ARE_REQUIRED);
            }
            const user = await this._userService.getUserByEmail(email);
            if (!user) {
                throw new Error(USERS_MESSAGE.CAT_FIND_USER);
            }
            await this._userService.resetPass(email, password);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.PASSWORD_RESET_SUCCESSFULLY, {});
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.PASSWORD_RESET_FAILED, message);
            logger.error(response)
            res.status(response.status).json(response);
        }

    };

    fetchAvailability = async (req: Request, res: Response): Promise<void> => {
        try {
            const { workerId } = req.query;
            const availability = await this._userService.fetchAvailability(workerId as string);
            const response = new successResponse(StatusCode.OK, USERS_MESSAGE.FETCH_AVAILABILITY_SUCCESS, availability);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.FETCH_AVAILABILITY_FAILD, message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    googleLogin = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            const result = await this._userService.googleLogin(token);

            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.GOOGLE_LOGIN_SUCCESS, { result });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            console.log(error)
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.GOOGLE_LOGIN_FAILED, message);
            logger.error(response)
            res.status(response.status).json(response);
        }
    }

    fetchData = async (req: Request | AuthRequest, res: Response): Promise<void> => {
        try {
            let userId: string | undefined = undefined;

            if (
                req.query.userId !== undefined &&
                req.query.userId !== "undefined" &&
                req.query.userId !== ""
            ) {
                console.log("Found in query", req.query);
                userId = String(req.query.userId);
            }

            if (!userId && (req as AuthRequest)?.user?.id) {
                console.log("Found in auth token");
                userId = String((req as AuthRequest).user?.id);
            }

            console.log("userId", userId);
            if (!userId) {
                throw new Error("User ID is required");
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
            console.error(error);
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(
                StatusCode.BAD_REQUEST,
                USERS_MESSAGE.FETCH_USER_FAILD,
                message
            );
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


    update = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { userDetails, userId } = req.body
            console.log("DAta comes :", userDetails, userId);
            const result = await this._userService.update(userDetails, userId);
            const response = new successResponse(StatusCode.CREATED, USERS_MESSAGE.USER_UPDATE_SUCCESS, { result });
            logger.info(response)
            res.status(response.status).json(response);
        } catch (error) {
            console.log(error)
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(StatusCode.BAD_REQUEST, USERS_MESSAGE.USER_UPDATE_FAILD, message);
            logger.error(response)
            res.status(response.status).json(response);
        }
    }

}