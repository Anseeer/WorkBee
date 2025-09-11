import { IChatDTO } from "../../mappers/chatMessage/chat.map.DTO.interface";
import { IMessageDTO } from "../../mappers/chatMessage/message.map.DTO.interface";
import { IMessage } from "../../model/chatMessage/IMessage";

export interface IChatService {
    findUsersInChat(userId: string): Promise<IChatDTO[] | null>
    findLastMessage(chatId: string): Promise<IMessageDTO[] | null>
    resetUnreadCount(chatId: string, userId: string): Promise<boolean>
    findChatbyChatId(chatId: string): Promise<IChatDTO | null>
    createMessage(messageData: Partial<IMessage>): Promise<IMessageDTO | null>
    updateChatOnSendMessage(chatData: { chatId: string, receiverId: string, messageId: string }, receiverViewing?: boolean): Promise<void>
}