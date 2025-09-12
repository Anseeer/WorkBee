"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const logger_1 = __importDefault(require("../utilities/logger"));
const inversify_container_1 = __importDefault(require("../inversify/inversify.container"));
const inversify_types_1 = __importDefault(require("../inversify/inversify.types"));
const initializeSocket = (io) => {
    const activeUsersInChat = new Map();
    const chatService = inversify_container_1.default.get(inversify_types_1.default.chatService);
    io.on("connection", (socket) => {
        logger_1.default.info("A user connected!", socket.id);
        socket.on("joinChat", async ({ chatId, userId }) => {
            socket.join(chatId);
            logger_1.default.info(`${socket.id} joined chat ${chatId}`);
            if (!activeUsersInChat.get(chatId)) {
                activeUsersInChat.set(chatId, new Set());
            }
            activeUsersInChat.get(chatId)?.add(userId);
            const last50 = await chatService.findLastMessage(chatId);
            await chatService.resetUnreadCount(chatId, userId);
            const updatedChatOnJoin = await chatService.findChatbyChatId(chatId);
            socket.emit("chatUpdate", {
                _id: chatId,
                lastMessage: updatedChatOnJoin?.lastMessage || null,
                unreadCount: 0,
            });
            socket.emit("previousMessages", last50);
        });
        socket.on("leaveChat", (chatId, userId) => {
            socket.leave(chatId);
            logger_1.default.info(`${socket.id} left chat ${chatId}`);
            activeUsersInChat.get(chatId)?.delete(userId);
            if (activeUsersInChat.get(chatId)?.size === 0) {
                activeUsersInChat.delete(chatId);
            }
        });
        socket.on("sendMessage", async ({ chatId, senderId, receiverId, content, contentType = "text" }) => {
            const messageData = {
                chatId,
                senderId,
                receiverId,
                content,
                contentType
            };
            const message = await chatService.createMessage(messageData);
            if (!message) {
                throw new Error("Cant ceate message");
            }
            const chatData = {
                chatId,
                receiverId: receiverId?.toString(),
                messageId: message?.id.toString(),
            };
            const receiverViewing = activeUsersInChat.get(chatId)?.has(chatData.receiverId) || false;
            await chatService.updateChatOnSendMessage(chatData, receiverViewing);
            const updatedChat = await chatService.findChatbyChatId(chatId);
            io.emit("message", message, updatedChat);
            io.to(receiverId.toString()).emit("chatUpdate", {
                chatId,
                lastMessage: updatedChat?.lastMessage,
                unreadCount: updatedChat?.unreadCounts?.get(receiverId.toString()) || 0,
            });
            io.to(senderId.toString()).emit("chatUpdate", {
                _id: chatId,
                lastMessage: updatedChat?.lastMessage,
                unreadCount: updatedChat?.unreadCounts?.get(senderId.toString()) || 0,
            });
        });
        socket.on("disconnect", () => {
            logger_1.default.info("A user disconnected", socket.id);
            activeUsersInChat.clear();
        });
    });
};
exports.initializeSocket = initializeSocket;
