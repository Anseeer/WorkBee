import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IChatService } from "../../services/chatMessage/chatMessage.service.interface";
import { IChatController } from "./chatMessage.controller.interface";
import { Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utilities/response";
import { StatusCode } from "../../constants/status.code";
import { CHAT_MESSAGE, USERS_MESSAGE } from "../../constants/messages";
import logger from "../../utilities/logger";
import { AuthRequest } from "../../middlewares/authMiddleware";

@injectable()
export class ChatController implements IChatController {
    private _chatService: IChatService;
    constructor(@inject(TYPES.chatService) chatService: IChatService) {
        this._chatService = chatService;
    }

    findUsersInChat = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req?.user?.id;
            if (!userId) {
                throw new Error(USERS_MESSAGE.USER_ID_NOT_GET)
            }
            const result = await this._chatService.findUsersInChat(userId as string);
            const response = new successResponse(StatusCode.OK, CHAT_MESSAGE.FIND_CHAT_BY_USER_SUCCESS, result);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            next(new errorResponse(StatusCode.BAD_REQUEST, CHAT_MESSAGE.FIND_CHAT_BY_USER_FAILD, errMsg));
        }
    }

}