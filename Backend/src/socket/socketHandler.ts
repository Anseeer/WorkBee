import { Server } from "socket.io";
import logger from "../utilities/logger";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { IChatService } from "../services/chatMessage/chatMessage.service.interface";
import { IMessage } from "../model/chatMessage/IMessage";

interface IUpdateChatData {
    chatId: string;
    receiverId: string;
    messageId: string;
}

export const initializeSocket = (io: Server) => {

    const activeUsersInChat: Map<string, Set<string>> = new Map();
    const chatService = container.get<IChatService>(TYPES.chatService);

    io.on("connection", (socket) => {
        logger.info("A user connected!", socket.id);

        socket.on("joinChat", async ({ chatId, userId }: { chatId: string; userId: string }) => {
            socket.join(chatId);
            logger.info(`${socket.id} joined chat ${chatId}`);

            if (!activeUsersInChat.get(chatId)) {
                activeUsersInChat.set(chatId, new Set());
            }
            activeUsersInChat.get(chatId)?.add(userId);

            const last50 = await chatService.findLastMessage(chatId)

            await chatService.resetUnreadCount(chatId, userId);

            const updatedChatOnJoin = await chatService.findChatbyChatId(chatId);
            socket.emit("chatUpdate", {
                _id: chatId,
                lastMessage: updatedChatOnJoin?.lastMessage || null,
                unreadCount: 0,
            });
            socket.emit("previousMessages", last50);
        });

        socket.on("leaveChat", (chatId: string, userId: string) => {
            socket.leave(chatId);
            logger.info(`${socket.id} left chat ${chatId}`);
            activeUsersInChat.get(chatId)?.delete(userId);
            if (activeUsersInChat.get(chatId)?.size === 0) {
                activeUsersInChat.delete(chatId);
            }
        });

        socket.on("sendMessage",
            async ({ chatId, senderId, receiverId, content, contentType = "text" }: IMessage) => {
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

                const chatData: IUpdateChatData = {
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
            }
        );

        socket.on("disconnect", () => {
            logger.info("A user disconnected", socket.id);
            activeUsersInChat.clear()
        });
    });
}