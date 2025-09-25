import { Server, Socket } from 'socket.io';
import logger from "../utilities/logger";
import container from "../inversify/inversify.container";
import TYPES from "../inversify/inversify.types";
import { IChatService } from "../services/chatMessage/chatMessage.service.interface";
import { IMessage } from "../model/chatMessage/IMessage";
import { INotificationService } from '../services/notification/notification.service.interface';

interface IUpdateChatData {
    chatId: string;
    receiverId: string;
    messageId: string;
}

interface CustomSocket extends Socket {
    userId?: string;
}

export const initializeSocket = (io: Server) => {
    const activeUsersInChat: Map<string, Set<string>> = new Map();
    const userSocketMap = new Map<string, string>();
    const chatService = container.get<IChatService>(TYPES.chatService);
    const notificationService = container.get<INotificationService>(TYPES.notificationService);

    io.on('connection', (socket: CustomSocket) => {
        logger.info(`A user connected! Socket ID: ${socket.id}`);

        socket.on('join-user-room', (userId: string) => {
            socket.join(userId);
            socket.userId = userId;
            userSocketMap.set(userId, socket.id);
            logger.info(`User ${userId} joined room ${userId}`);
        });

        socket.on('joinChat', async ({ chatId, userId }: { chatId: string; userId: string }) => {
            socket.join(chatId);
            logger.info(`${socket.id} joined chat ${chatId}`);
            if (!activeUsersInChat.get(chatId)) {
                activeUsersInChat.set(chatId, new Set());
            }
            activeUsersInChat.get(chatId)?.add(userId);
            const last50 = await chatService.findLastMessage(chatId);
            await chatService.resetUnreadCount(chatId, userId);
            const updatedChatOnJoin = await chatService.findChatbyChatId(chatId);
            socket.emit('chatUpdate', {
                _id: chatId,
                lastMessage: updatedChatOnJoin?.lastMessage || null,
                unreadCount: 0,
            });
            socket.emit('previousMessages', last50);
        });

        socket.on('leaveChat', (chatId: string, userId: string) => {
            socket.leave(chatId);
            logger.info(`${socket.id} left chat ${chatId}`);
            activeUsersInChat.get(chatId)?.delete(userId);
            if (activeUsersInChat.get(chatId)?.size === 0) {
                activeUsersInChat.delete(chatId);
            }
        });

        socket.on('sendMessage', async ({ chatId, senderId, receiverId, content, contentType = 'text' }: IMessage) => {
            const messageData = {
                chatId,
                senderId,
                receiverId,
                content,
                contentType,
            };
            const message = await chatService.createMessage(messageData);
            if (!message) {
                socket.emit('error', { message: 'Can\'t create message' });
                return;
            }
            const chatData: IUpdateChatData = {
                chatId,
                receiverId: receiverId?.toString(),
                messageId: message?.id.toString(),
            };
            const receiverViewing = activeUsersInChat.get(chatId)?.has(chatData.receiverId) || false;
            await chatService.updateChatOnSendMessage(chatData, receiverViewing);
            const updatedChat = await chatService.findChatbyChatId(chatId);
            io.to(chatId).emit('message', message, updatedChat);
            io.to(receiverId.toString()).emit('chatUpdate', {
                _id: chatId,
                lastMessage: updatedChat?.lastMessage,
                unreadCount: updatedChat?.unreadCounts?.get(receiverId.toString()) || 0,
            });
            io.to(senderId.toString()).emit('chatUpdate', {
                _id: chatId,
                lastMessage: updatedChat?.lastMessage,
                unreadCount: updatedChat?.unreadCounts?.get(senderId.toString()) || 0,
            });
        });

        socket.on('webrtc-offer', ({ targetUserId, offer, callerId }) => {
            const targetSocketId = userSocketMap.get(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('webrtc-offer', { offer, callerId });
                logger.info(`Offer sent from ${callerId} to ${targetUserId}`);
            } else {
                logger.error(`Target user ${targetUserId} not found`);
                socket.emit('call-error', { message: 'User not found' });
            }
        });

        socket.on('webrtc-ice-candidate', ({ targetUserId, candidate }) => {
            const targetSocketId = userSocketMap.get(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('webrtc-ice-candidate', { candidate });
                logger.info(`ICE candidate sent to ${targetUserId}`);
            } else {
                logger.error(`Target user ${targetUserId} not found`);
            }
        });

        socket.on('webrtc-answer', ({ targetUserId, answer }) => {
            const targetSocketId = userSocketMap.get(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('webrtc-answer', { answer });
                logger.info(`Answer sent to ${targetUserId}`);
            } else {
                logger.error(`Target user ${targetUserId} not found`);
                socket.emit('call-error', { message: 'User not found' });
            }
        });

        socket.on('webrtc-reject', ({ targetUserId }) => {
            const targetSocketId = userSocketMap.get(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('webrtc-reject');
                logger.info(`Call rejected sent to ${targetUserId}`);
            } else {
                logger.error(`Target user ${targetUserId} not found`);
            }
        });

        socket.on('webrtc-end-call', ({ targetUserId }) => {
            const targetSocketId = userSocketMap.get(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('webrtc-end-call');
                logger.info(`Call ended sent to ${targetUserId}`);
            } else {
                logger.error(`Target user ${targetUserId} not found`);
            }
        });

        socket.on("push-notification", async ({ notification }) => {
            if (!notification || !notification.recipient) return;
            try {
                const newNotification = await notificationService.create(notification);
                io.to(notification.recipient).emit("new-notification", newNotification);
            } catch (err) {
                console.error("Error creating notification:", err);
            }
        });

        socket.on("get-notifications", async ({ userId }) => {
            if (!userId) return;
            const notifications = await notificationService.getUserNotification(userId);
            socket.emit("notifications_list", notifications);
        });

        socket.on('disconnect', () => {
            if (socket.userId) {
                userSocketMap.delete(socket.userId);
                activeUsersInChat.forEach((users, chatId) => {
                    users.delete(socket.userId!);
                    if (users.size === 0) {
                        activeUsersInChat.delete(chatId);
                    }
                });
                logger.info(`User ${socket.userId} disconnected`);
            }
        });
    });
}