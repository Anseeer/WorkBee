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
exports.MessageRepository = void 0;
const inversify_1 = require("inversify");
const messages_1 = require("../../constants/messages");
const message_model_1 = __importDefault(require("../../model/chatMessage/message.model"));
const base_repo_1 = __importDefault(require("../base/base.repo"));
let MessageRepository = class MessageRepository extends base_repo_1.default {
    constructor() {
        super(message_model_1.default);
    }
    async findLastMessage(chatId) {
        try {
            if (!chatId) {
                throw new Error(messages_1.CHAT_MESSAGE.CHAT_ID_NOT_GET);
            }
            return await this.model.find({ chatId })
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
        }
        catch (error) {
            console.error('Error in findLastMessage:', error);
            throw new Error('Error in findLastMessage');
        }
    }
};
exports.MessageRepository = MessageRepository;
exports.MessageRepository = MessageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], MessageRepository);
