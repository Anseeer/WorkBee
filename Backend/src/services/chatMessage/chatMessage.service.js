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
exports.ChatService = void 0;
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const chat_map_DTO_1 = require("../../mappers/chatMessage/chat.map.DTO");
const messages_1 = require("../../constants/messages");
const message_map_DTO_1 = require("../../mappers/chatMessage/message.map.DTO");
let ChatService = class ChatService {
    constructor(chatRepo, messageRepo) {
        this._chatRepository = chatRepo;
        this._messageRepository = messageRepo;
    }
    async findUsersInChat(userId) {
        if (!userId) {
            throw new Error(messages_1.USERS_MESSAGE.USER_ID_NOT_GET);
        }
        const res = await this._chatRepository.findChatByUsers(userId);
        if (!res) {
            return null;
        }
        const chat = res.map((chat) => (0, chat_map_DTO_1.mapChatToDTO)(chat));
        return chat;
    }
    async findLastMessage(chatId) {
        if (!chatId) {
            throw new Error(messages_1.CHAT_MESSAGE.CHAT_ID_NOT_GET);
        }
        const lastMsg = await this._messageRepository.findLastMessage(chatId);
        const lastMessage = lastMsg?.map((msg) => (0, message_map_DTO_1.mapMessageToDTO)(msg));
        return lastMessage;
    }
    async resetUnreadCount(chatId, userId) {
        if (!chatId || !userId) {
            throw new Error(messages_1.CHAT_MESSAGE.CHAT_ID_OR_USER_ID_NOT_GET);
        }
        return await this._chatRepository.resetUnreadCount(chatId, userId);
    }
    async findChatbyChatId(chatId) {
        if (!chatId) {
            throw new Error(messages_1.CHAT_MESSAGE.CHAT_ID_NOT_GET);
        }
        const findChat = await this._chatRepository.findByChatId(chatId);
        const chat = (0, chat_map_DTO_1.mapChatToDTO)(findChat);
        return chat;
    }
    async createMessage(messageData) {
        if (!messageData) {
            throw new Error(messages_1.CHAT_MESSAGE.MESSAGE_DATA_NOT_GET);
        }
        const msg = await this._messageRepository.create(messageData);
        const message = (0, message_map_DTO_1.mapMessageToDTO)(msg);
        return message;
    }
    async updateChatOnSendMessage(chatData, receiverViewing) {
        if (!chatData) {
            throw new Error(messages_1.CHAT_MESSAGE.CHAT_DATA_NOT_GET);
        }
        await this._chatRepository.updateChatOnSendMessage(chatData.chatId, chatData.receiverId, chatData.messageId, receiverViewing);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.chatRepository)),
    __param(1, (0, inversify_1.inject)(inversify_types_1.default.messageRepository)),
    __metadata("design:paramtypes", [Object, Object])
], ChatService);
