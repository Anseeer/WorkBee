import { IChat } from "../../model/chatMessage/IChat";
import { Iwrite } from "../base/base.repo.interface";

export interface IChatRepositoy extends Iwrite<IChat> {
    findChat(participants: string[]): Promise<IChat[] | null>;
    findChatByUsers(userId: string): Promise<IChat[] | null>
    findByChatId(chatId: string): Promise<IChat | null>
    updateChatOnSendMessage(chatId: string, receiverId: string, messageId: string, receiverViewing?: boolean): Promise<void>
    resetUnreadCount(chatId: string, userId: string): Promise<boolean>;
}