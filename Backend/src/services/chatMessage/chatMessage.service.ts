import { inject, injectable } from "inversify";
import { IChatService } from "./chatMessage.service.interface";
import { IChatRepositoy } from "../../repositories/chat/chat.repo.interface";
import TYPES from "../../inversify/inversify.types";
import { mapChatToDTO } from "../../mappers/chatMessage/chat.map.DTO";
import { IChatDTO } from "../../mappers/chatMessage/chat.map.DTO.interface";
import { IMessageRepository } from "../../repositories/message/message.repo.interface";
import { IMessage } from "../../model/chatMessage/IMessage";
import { CHAT_MESSAGE, USERS_MESSAGE } from "../../constants/messages";
import { IChat } from "../../model/chatMessage/IChat";
import { IMessageDTO } from "../../mappers/chatMessage/message.map.DTO.interface";
import { mapMessageToDTO } from "../../mappers/chatMessage/message.map.DTO";

@injectable()
export class ChatService implements IChatService {
    private _chatRepository: IChatRepositoy;
    private _messageRepository: IMessageRepository;
    constructor(
        @inject(TYPES.chatRepository) chatRepo: IChatRepositoy,
        @inject(TYPES.messageRepository) messageRepo: IMessageRepository
    ) {
        this._chatRepository = chatRepo;
        this._messageRepository = messageRepo;
    }

    async findUsersInChat(userId: string): Promise<IChatDTO[] | null> {
        try {
            if (!userId) {
                throw new Error(USERS_MESSAGE.USER_ID_NOT_GET);
            }

            const res = await this._chatRepository.findChatByUsers(userId);
            if (!res) return null;

            const chat = res.map((chat) => mapChatToDTO(chat));
            return chat;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async findLastMessage(chatId: string): Promise<IMessageDTO[] | null> {
        try {
            if (!chatId) {
                throw new Error(CHAT_MESSAGE.CHAT_ID_NOT_GET);
            }
            const lastMsg = await this._messageRepository.findLastMessage(chatId);
            const lastMessage = lastMsg?.map((msg) => mapMessageToDTO(msg));
            return lastMessage as IMessageDTO[];
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async resetUnreadCount(chatId: string, userId: string): Promise<boolean> {
        try {
            if (!chatId || !userId) {
                throw new Error(CHAT_MESSAGE.CHAT_ID_OR_USER_ID_NOT_GET);
            }
            return await this._chatRepository.resetUnreadCount(chatId, userId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async findChatbyChatId(chatId: string): Promise<IChatDTO | null> {
        try {
            if (!chatId) {
                throw new Error(CHAT_MESSAGE.CHAT_ID_NOT_GET);
            }
            const findChat = await this._chatRepository.findByChatId(chatId);
            const chat = mapChatToDTO(findChat as IChat);
            return chat;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async createMessage(messageData: Partial<IMessage>): Promise<IMessageDTO | null> {
        try {
            if (!messageData) {
                throw new Error(CHAT_MESSAGE.MESSAGE_DATA_NOT_GET);
            }
            const msg = await this._messageRepository.create(messageData);
            const message = mapMessageToDTO(msg);
            return message;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async updateChatOnSendMessage(
        chatData: { chatId: string; receiverId: string; messageId: string; },
        receiverViewing: boolean
    ): Promise<void> {
        try {
            if (!chatData) {
                throw new Error(CHAT_MESSAGE.CHAT_DATA_NOT_GET);
            }
            await this._chatRepository.updateChatOnSendMessage(
                chatData.chatId,
                chatData.receiverId,
                chatData.messageId,
                receiverViewing
            );
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

}