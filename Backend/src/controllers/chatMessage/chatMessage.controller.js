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
exports.ChatController = void 0;
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const response_1 = require("../../utilities/response");
const status_code_1 = require("../../constants/status.code");
const messages_1 = require("../../constants/messages");
const logger_1 = __importDefault(require("../../utilities/logger"));
let ChatController = class ChatController {
    constructor(chatService) {
        this.findUsersInChat = async (req, res, next) => {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    throw new Error(messages_1.USERS_MESSAGE.USER_ID_NOT_GET);
                }
                const result = await this._chatService.findUsersInChat(userId);
                const response = new response_1.successResponse(status_code_1.StatusCode.OK, messages_1.CHAT_MESSAGE.FIND_CHAT_BY_USER_SUCCESS, result);
                logger_1.default.info(response);
                res.status(response.status).json(response);
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                next(new response_1.errorResponse(status_code_1.StatusCode.BAD_REQUEST, messages_1.CHAT_MESSAGE.FIND_CHAT_BY_USER_FAILD, errMsg));
            }
        };
        this._chatService = chatService;
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.chatService)),
    __metadata("design:paramtypes", [Object])
], ChatController);
