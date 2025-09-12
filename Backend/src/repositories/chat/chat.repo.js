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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const inversify_1 = require("inversify");
const base_repo_1 = __importDefault(require("../base/base.repo"));
const chat_model_1 = __importDefault(require("../../model/chatMessage/chat.model"));
const mongoose_1 = require("mongoose");
const messages_1 = require("../../constants/messages");
let ChatRepository = class ChatRepository extends base_repo_1.default {
    constructor() {
        super(chat_model_1.default);
    }
    async findChat(participants) {
        try {
            if (!participants || participants.length < 2) {
                throw new Error("Participants must contain at least 2 users!");
            }
            const chat = await this.model.find({
                "participants.participantId": {
                    $all: participants.map(id => new mongoose_1.Types.ObjectId(id))
                }
            });
            return chat.length > 0 ? chat : null;
        }
        catch (error) {
            console.error('Error in findChat:', error);
            throw new Error('Error in findChat');
        }
    }
    async findChatByUsers(userId) {
        try {
            if (!userId) {
                throw new Error("userId is required!");
            }
            return await this.model.find({
                "participants.participantId": userId
            })
                .populate("participants.participantId", "name profileImage")
                .populate("lastMessage");
        }
        catch (error) {
            console.error('Error in findChatByUsers:', error);
            throw new Error('Error in findChatByUsers');
        }
    }
    async findByChatId(chatId) {
        try {
            if (!chatId) {
                throw new Error(messages_1.CHAT_MESSAGE.CHAT_ID_NOT_GET);
            }
            return await this.model.findById(chatId).populate('lastMessage');
        }
        catch (error) {
            console.error('Error in findByChatId:', error);
            throw new Error('Error in findByChatId');
        }
    }
    async updateChatOnSendMessage(chatId, receiverId, messageId, receiverViewing) {
        try {
            if (!chatId || !receiverId || !messageId) {
                throw new Error("Cant get chatId or receiverId or messageId");
            }
            const value = receiverViewing ? 0 : 1;
            await this.model.updateOne({ _id: chatId }, {
                $set: { lastMessage: messageId },
                $inc: { [`unreadCounts.${receiverId}`]: value },
            });
        }
        catch (error) {
            console.error('Error in updateChatOnSendMessage:', error);
            throw new Error('Error in updateChatOnMessage');
        }
    }
    async resetUnreadCount(chatId, userId) {
        try {
            if (!chatId || !userId) {
                throw new Error("chatId or userId not provided!");
            }
            console.log("ChatId :", chatId);
            console.log("UserId :", userId);
            const result = await this.model.updateOne({ _id: new mongoose_1.Types.ObjectId(chatId) }, { $set: { [`unreadCounts.${userId}`]: 0 } });
            console.log("Modified Count:", result.modifiedCount);
            return result.modifiedCount > 0;
        }
        catch (error) {
            console.error('Error in resetUnreadCount:', error);
            throw new Error('Error in resetUnreadCount');
        }
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ChatRepository);
